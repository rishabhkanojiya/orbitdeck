package api

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hibiken/asynq"
	db "github.com/rishabhkanojiya/orbitdeck/server/core/db/sqlc"
	"github.com/rishabhkanojiya/orbitdeck/server/core/worker"
)

type CreateDeploymentRequest struct {
	Name        string             `json:"name"`
	Environment string             `json:"environment"`
	Components  []ComponentRequest `json:"components"`
	Ingress     *IngressRequest    `json:"ingress"` // Make ingress optional

}

type IngressRequest struct {
	Host        string `json:"host"`
	Path        string `json:"path,omitempty"`
	ServiceName string `json:"serviceName,omitempty"`
	ServicePort int32  `json:"servicePort,omitempty"`
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

	if req.Ingress == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ingress value is required"})
		return
	}

	if req.Ingress != nil && req.Ingress.Host != "" {
		params.Ingress = generateIngressFromComponents(req.Ingress.Host, req.Components, req.Ingress)
	}

	AfterCreate := func(id int64) error {
		taskPayload := &worker.PayloadGenerateHelm{
			Id: id,
		}
		opts := []asynq.Option{
			asynq.MaxRetry(0),
			asynq.ProcessIn(1 * time.Second),
			asynq.Queue(worker.QueueCore),
		}
		return server.taskDistributor.DistributeTaskGenerateHelm(ctx, taskPayload, opts...)
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

	deployment, err := server.store.CreateDeploymentTx(ctx, params, AfterCreate)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"id":           deployment.ID,
		"helm_release": deployment.HelmRelease,
	})
}

func generateIngressFromComponents(host string, components []ComponentRequest, ingressReq *IngressRequest) []db.IngressParams {
	var ingressRules []db.IngressParams

	for _, comp := range components {
		rule := db.IngressParams{
			Host:        host,
			Path:        fmt.Sprintf("/api/%s", comp.Name),
			ServiceName: comp.Name,
			ServicePort: comp.ServicePort,
		}

		if ingressReq != nil {
			if ingressReq.Path != "" {
				rule.Path = ingressReq.Path
			}
			if ingressReq.ServiceName != "" {
				rule.ServiceName = ingressReq.ServiceName
			}
			if ingressReq.ServicePort != 0 {
				rule.ServicePort = ingressReq.ServicePort
			}
		}

		if comp.Name == "client" {
			rule.Path = "/?(.*)"
		}

		ingressRules = append(ingressRules, rule)
	}

	return ingressRules
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

func (server *Server) UninstallDeployment(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	deployment, err := server.store.GetDeployment(c.Request.Context(), int64(id))
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "deployment not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	taskPayload := &worker.PayloadUninstallHelm{
		Id: id,
	}
	opts := []asynq.Option{
		asynq.MaxRetry(0),
		asynq.ProcessIn(1 * time.Second),
		asynq.Queue(worker.QueueCore),
	}
	server.taskDistributor.DistributeTaskUninstallHelm(c, taskPayload, opts...)

	c.JSON(http.StatusOK, gin.H{
		"deployment": deployment,
		"Message":    fmt.Sprintf("Helm Release %s will be removed soon", deployment.HelmRelease.String),
	})
}
