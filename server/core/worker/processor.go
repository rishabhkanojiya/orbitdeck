package worker

import (
	"context"

	db "github.com/rishabhkanojiya/orbitdeck/server/core/db/sqlc"
	service "github.com/rishabhkanojiya/orbitdeck/server/core/service"

	"github.com/hibiken/asynq"
	"github.com/rs/zerolog/log"
)

const (
	QueueCore     = "core"
	QueueCritical = "critical"
	QueueDefault  = "default"
)

type TaskProcessor interface {
	Start() error
	ProcessTaskGenerateHelm(ctx context.Context, task *asynq.Task) error
}

type RedisTaskProcessor struct {
	server  *asynq.Server
	store   db.Store
	helmSvc *service.HelmService
}

func NewRedisTaskProcessor(redisOpt asynq.RedisClientOpt, store db.Store, helmSvc *service.HelmService) TaskProcessor {
	server := asynq.NewServer(
		redisOpt,
		asynq.Config{
			Queues: map[string]int{
				QueueCore:     10,
				QueueCritical: 10,
				QueueDefault:  5,
			},
			ErrorHandler: asynq.ErrorHandlerFunc(func(ctx context.Context, task *asynq.Task, err error) {
				log.Error().Err(err).Str("type", task.Type()).
					Bytes("payload", task.Payload()).Msg("process task failed")
			}),
			Logger: NewLogger(),
		},
	)

	return &RedisTaskProcessor{
		server:  server,
		store:   store,
		helmSvc: helmSvc,
	}
}

func (processor *RedisTaskProcessor) Start() error {
	mux := asynq.NewServeMux()

	mux.HandleFunc(TaskGenerateHelm, processor.ProcessTaskGenerateHelm)

	return processor.server.Start(mux)
}
