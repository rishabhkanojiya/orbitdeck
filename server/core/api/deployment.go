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
		ctx.JSON(errorResponse(http.StatusBadRequest, err))
		return
	}

	for _, comp := range req.Components {
		if comp.Image.Repository == "" {
			ctx.JSON(errorResponse(http.StatusBadRequest, errors.New("image repository is required")))
			return
		}
	}

	params := db.DeploymentParams{
		Name:        req.Name,
		Environment: req.Environment,
		Components:  make([]db.ComponentParams, len(req.Components)),
	}

	if req.Ingress == nil {
		ctx.JSON(errorResponse(http.StatusBadRequest, errors.New("ingress value is required")))
		return
	}

	if req.Ingress != nil && req.Ingress.Host != "" {
		params.Ingress = generateIngressFromComponents(req.Ingress.Host, req.Components, req.Ingress)
	}

	AfterCreate := func(id int64) (string, error) {
		taskPayload := &worker.PayloadGenerateHelm{Id: id}
		opts := []asynq.Option{asynq.MaxRetry(1), asynq.ProcessIn(1 * time.Second), asynq.Queue(worker.QueueGenerate)}
		info, err := server.taskDistributor.DistributeTaskGenerateHelm(ctx, taskPayload, opts...)
		if err != nil {
			return "", err
		}
		params.TaskId = info.ID
		return info.ID, nil
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
		ctx.JSON(errorResponse(http.StatusInternalServerError, err))
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
		c.JSON(errorResponse(http.StatusBadRequest, err))
		return
	}

	deployment, err := server.store.GetDeploymentObject(c.Request.Context(), int64(id))
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(errorResponse(http.StatusNotFound, errors.New("deployment not found")))
			return
		}
		c.JSON(errorResponse(http.StatusInternalServerError, err))
		return
	}

	c.JSON(http.StatusOK, deployment)
}

func (server *Server) GetDeployments(c *gin.Context) {
	pageNoStr := c.DefaultQuery("pageNo", "1")
	pageSizeStr := c.DefaultQuery("pageSize", "10")

	pageNo, err := strconv.Atoi(pageNoStr)
	if err != nil || pageNo < 1 {
		pageNo = 1
	}
	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize < 1 {
		pageSize = 10
	}

	offset := (pageNo - 1) * pageSize

	result, err := server.store.GetPaginatedDeploymentObjects(c.Request.Context(), int32(pageSize), int32(offset))
	if err != nil {
		c.JSON(errorResponse(http.StatusInternalServerError, err))
		return
	}

	page := gin.H{
		"type":      "number",
		"size":      len(result.Results),
		"current":   pageNo,
		"hasNext":   int64(pageNo*pageSize) < result.Total,
		"itemTotal": result.Total,
	}

	c.JSON(http.StatusOK, gin.H{
		"items": result.Results,
		"page":  page,
	})
}

func (server *Server) UninstallDeployment(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(errorResponse(http.StatusBadRequest, err))
		return
	}

	deployment, err := server.store.GetDeployment(c.Request.Context(), int64(id))
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(errorResponse(http.StatusNotFound, errors.New("deployment not found")))
			return
		}
		c.JSON(errorResponse(http.StatusInternalServerError, err))
		return
	}

	taskPayload := &worker.PayloadUninstallHelm{
		Id: id,
	}
	opts := []asynq.Option{
		asynq.MaxRetry(0),
		asynq.ProcessIn(1 * time.Second),
		asynq.Queue(worker.QueueUninstall),
	}
	server.taskDistributor.DistributeTaskUninstallHelm(c, taskPayload, opts...)

	c.JSON(http.StatusOK, gin.H{
		"deployment": deployment,
		"Message":    fmt.Sprintf("Helm Release %s will be removed soon", deployment.HelmRelease.String),
	})
}

func (server *Server) GetDeploymentStatus(ctx *gin.Context) {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err != nil {
		ctx.JSON(errorResponse(http.StatusBadRequest, err))
		return
	}

	deployment, err := server.store.GetDeployment(ctx, id)
	if err != nil {
		ctx.JSON(errorResponse(http.StatusInternalServerError, err))
		return
	}

	if !deployment.TaskID.Valid {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "no task ID found"})
		return
	}

	inspector := asynq.NewInspector(asynq.RedisClientOpt{Addr: server.config.REDIS_ADDRESS})

	info, err := inspector.GetTaskInfo(worker.QueueGenerate, deployment.TaskID.String)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{"state": "completed"})
		return
	}

	stateEnum := map[int]string{
		1: "pending",
		2: "active",
		3: "scheduled",
		4: "retry",
		5: "archived",
		6: "completed",
	}

	enumVal := stateEnum[int(info.State)]
	if enumVal == "" {
		enumVal = "completed"
	}

	ctx.JSON(http.StatusOK, gin.H{"state": enumVal})
}
