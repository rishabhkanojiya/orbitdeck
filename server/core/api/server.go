package api

import (
	"fmt"

	"github.com/rishabhkanojiya/orbitdeck/server/auth/token"
	"github.com/rishabhkanojiya/orbitdeck/server/core/config"
	db "github.com/rishabhkanojiya/orbitdeck/server/core/db/sqlc"
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
	taskDistributor worker.TaskDistributor
}

// NewServer creates a new HTTP server and set up routing.
func NewServer(config config.Config, store db.Store, taskDistributor worker.TaskDistributor) (*Server, error) {
	tokenMaker, err := token.NewPasetoMaker(config.TOKEN_SYMMETRIC_KEY)
	if err != nil {
		return nil, fmt.Errorf("cannot create token maker: %w", err)
	}

	server := &Server{
		config:          config,
		store:           store,
		tokenMaker:      tokenMaker,
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
		AllowOrigins:     []string{"*"}, // Change this to specific origins if needed
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// deploymentRoutes := router.Group("/deployment").Use(api.AuthMiddleware(server.tokenMaker))
	deploymentRoutes := router.Group("/deployment")
	deploymentRoutes.POST("/add", server.CreateDeployment)
	deploymentRoutes.GET("/:id", server.GetDeployment)
	deploymentRoutes.POST("/:id", server.UninstallDeployment)

	server.router = router
}

func (server *Server) Start(address string) error {
	return server.router.Run(address)
}

func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}
