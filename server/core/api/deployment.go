package api

import (
	"database/sql"
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	db "github.com/rishabhkanojiya/orbitdeck/server/core/db/sqlc"
)

type CreateDeploymentRequest struct {
	Name        string             `json:"name"`
	Environment string             `json:"environment"`
	Components  []ComponentRequest `json:"components"`
}

type ComponentRequest struct {
	Name         string           `json:"name"`
	Image        ImageRequest     `json:"image"`
	ReplicaCount int32            `json:"replica_count"`
	ServicePort  int32            `json:"service_port"`
	Resources    ResourcesRequest `json:"resources"`
	Env          []EnvVarRequest  `json:"env"`
}

type ImageRequest struct {
	Repository string `json:"repository"`
	Tag        string `json:"tag"`
}

type ResourcesRequest struct {
	Requests struct {
		CPU    string `json:"cpu"`
		Memory string `json:"memory"`
	} `json:"requests"`
	Limits struct {
		CPU    string `json:"cpu"`
		Memory string `json:"memory"`
	} `json:"limits"`
}

type EnvVarRequest struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

func (server *Server) CreateDeployment(ctx *gin.Context) {
	var req CreateDeploymentRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	for _, comp := range req.Components {
		if comp.Image.Repository == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "image repository is required"})
			return
		}
	}

	params := db.DeploymentParams{
		Name:        req.Name,
		Environment: req.Environment,
		Components:  make([]db.ComponentParams, len(req.Components)),
	}

	for i, comp := range req.Components {
		params.Components[i] = db.ComponentParams{
			Name:         comp.Name,
			ReplicaCount: comp.ReplicaCount,
			ServicePort:  comp.ServicePort,
			Image: db.ImageParams{
				Repository: comp.Image.Repository,
				Tag:        comp.Image.Tag,
			},
			Resources: db.ResourcesParams{
				Requests: struct {
					CPU    string
					Memory string
				}{
					CPU:    comp.Resources.Requests.CPU,
					Memory: comp.Resources.Requests.Memory,
				},
				Limits: struct {
					CPU    string
					Memory string
				}{
					CPU:    comp.Resources.Limits.CPU,
					Memory: comp.Resources.Limits.Memory,
				},
			},
			Env: make([]db.GetComponentEnvVarsRow, len(comp.Env)),
		}

		for j, env := range comp.Env {
			params.Components[i].Env[j] = db.GetComponentEnvVarsRow{
				Key:   env.Key,
				Value: env.Value,
			}
		}
	}

	deployment, err := server.store.CreateDeploymentTx(ctx, params)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	// // Deploy to Helm
	// if err := server.helmSvc.Deploy(deployment); err != nil {
	// 	ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Helm deployment failed: " + err.Error()})
	// 	return
	// }

	ctx.JSON(http.StatusCreated, gin.H{
		"id":           deployment.ID,
		"helm_release": deployment.HelmRelease,
	})
}

func (server *Server) GetDeployment(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	deployment, err := server.store.GetDeploymentObject(c.Request.Context(), int64(id))
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "deployment not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, deployment)
}
