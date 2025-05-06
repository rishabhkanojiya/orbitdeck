package api

import (
	"fmt"

	"github.com/rishabhkanojiya/orbitdeck/server/auth/api"
	"github.com/rishabhkanojiya/orbitdeck/server/auth/token"
	"github.com/rishabhkanojiya/orbitdeck/server/core/config"
	db "github.com/rishabhkanojiya/orbitdeck/server/core/db/sqlc"
	"github.com/rishabhkanojiya/orbitdeck/server/core/publish"
	"github.com/rishabhkanojiya/orbitdeck/server/core/util"
	"github.com/rishabhkanojiya/orbitdeck/server/core/worker"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

// Server serves HTTP requests for our banking service.
type Server struct {
	config          config.Config
	store           db.Store
	tokenMaker      token.Maker
	router          *gin.Engine
	publisher       publish.EventPublisher
	taskDistributor worker.TaskDistributor
}

// NewServer creates a new HTTP server and set up routing.
func NewServer(config config.Config, store db.Store, eventPublisher publish.EventPublisher, taskDistributor worker.TaskDistributor) (*Server, error) {
	tokenMaker, err := token.NewPasetoMaker(config.TOKEN_SYMMETRIC_KEY)
	if err != nil {
		return nil, fmt.Errorf("cannot create token maker: %w", err)
	}

	server := &Server{
		config:          config,
		store:           store,
		tokenMaker:      tokenMaker,
		publisher:       eventPublisher,
		taskDistributor: taskDistributor,
	}

	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("currency", validCurrency)
	}

	server.setupRouter()
	return server, nil
}

func (server *Server) setupRouter() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://orbitdeck.relise.tech", "https://orbitdeck.relise.tech", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	deploymentRoutes := router.Group("/deployment").Use(api.AuthMiddleware(server.tokenMaker))

	deploymentRoutes.GET("", server.GetDeployments)
	deploymentRoutes.POST("/add", server.CreateDeployment)
	deploymentRoutes.GET("/:id", server.GetDeployment)
	deploymentRoutes.DELETE("/:id", server.UninstallDeployment)
	deploymentRoutes.GET("/:id/status", server.GetDeploymentStatus)

	server.router = router
}

func (server *Server) Start(address string) error {
	return server.router.Run(address)
}

func errorResponse(status int, err error) (int, util.ErrorResponse) {
	var customErr = &util.Error{
		Status:  status,
		Message: err.Error(),
	}

	errRet := util.FormatErrorResponse(customErr)

	return status, errRet
}
