package api

import (
	"fmt"
	"log"

	"github.com/rishabhkanojiya/orbitdeck/server/auth/config"
	db "github.com/rishabhkanojiya/orbitdeck/server/auth/db/sqlc"
	"github.com/rishabhkanojiya/orbitdeck/server/auth/token"
	"github.com/rishabhkanojiya/orbitdeck/server/auth/worker"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
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

	server.setupRouter()
	return server, nil
}

func LogCORSRejections() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if origin != "" {
			// Check if the origin is allowed (you can customize this logic)
			allowedOrigins := []string{"http://orbitdeck.app", "http://orbitdeck.app"}
			isAllowed := false
			for _, allowedOrigin := range allowedOrigins {
				if origin == allowedOrigin {
					isAllowed = true
					break
				}
			}

			if !isAllowed {
				// Log the rejected origin
				log.Printf("CORS request rejected: Origin '%s' is not allowed", origin)
			}
		}

		// Continue to the next middleware/handler
		c.Next()
	}
}

func (server *Server) setupRouter() {
	router := gin.Default()
	router.Use(LogCORSRejections())

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://orbitdeck.app", "http://orbitdeck.app", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	router.Use(LogCORSRejections())
	router.POST("/users", server.createUser)
	router.POST("/users/login", server.loginUser)
	router.POST("/tokens/renew_access", server.renewAccessToken)

	server.router = router
}

func (server *Server) Start(address string) error {
	return server.router.Run(address)
}

func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}
