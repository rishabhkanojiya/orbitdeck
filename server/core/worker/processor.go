package worker

import (
	"context"

	db "github.com/rishabhkanojiya/orbitdeck/server/core/db/sqlc"
	"github.com/rishabhkanojiya/orbitdeck/server/core/publish"
	service "github.com/rishabhkanojiya/orbitdeck/server/core/service"

	"github.com/hibiken/asynq"
	"github.com/rs/zerolog/log"
)

const (
	QueueGenerate  = "generate"
	QueueUninstall = "uninstall"
	QueueCritical  = "critical"
	QueueDefault   = "default"
)

type TaskProcessor interface {
	Start() error
	StartSpecific(workerType string) error
	ProcessTaskGenerateHelm(ctx context.Context, task *asynq.Task) error
	ProcessTaskUninstallHelm(ctx context.Context, task *asynq.Task) error
}

type RedisTaskProcessor struct {
	server    *asynq.Server
	store     db.Store
	helmSvc   *service.HelmService
	publisher publish.EventPublisher
}

func NewRedisTaskProcessor(redisOpt asynq.RedisClientOpt, store db.Store, publisher publish.EventPublisher, helmSvc *service.HelmService, workerType string) TaskProcessor {

	var queueConfig map[string]int

	switch workerType {
	case "generate-helm":
		queueConfig = map[string]int{QueueGenerate: 1}
	case "uninstall-helm":
		queueConfig = map[string]int{QueueUninstall: 1}
	default:
		queueConfig = map[string]int{
			QueueGenerate:  3,
			QueueUninstall: 3,
			QueueCritical:  5,
			QueueDefault:   1,
		}
	}

	server := asynq.NewServer(
		redisOpt,
		asynq.Config{
			Queues: queueConfig,
			ErrorHandler: asynq.ErrorHandlerFunc(func(ctx context.Context, task *asynq.Task, err error) {
				log.Error().Err(err).Str("type", task.Type()).
					Bytes("payload", task.Payload()).Msg("process task failed")
			}),
			Logger: NewLogger(),
		},
	)

	return &RedisTaskProcessor{
		server:    server,
		store:     store,
		helmSvc:   helmSvc,
		publisher: publisher,
	}
}

func (processor *RedisTaskProcessor) Start() error {
	mux := asynq.NewServeMux()

	mux.HandleFunc(TaskGenerateHelm, processor.ProcessTaskGenerateHelm)
	mux.HandleFunc(TaskUninstallHelm, processor.ProcessTaskUninstallHelm)

	return processor.server.Start(mux)
}

func (processor *RedisTaskProcessor) StartSpecific(workerType string) error {
	mux := asynq.NewServeMux()

	switch workerType {
	case "generate-helm":
		mux.HandleFunc(TaskGenerateHelm, processor.ProcessTaskGenerateHelm)
	case "uninstall-helm":
		mux.HandleFunc(TaskUninstallHelm, processor.ProcessTaskUninstallHelm)
	default:
		log.Fatal().Msg("Invalid task type for processor")
	}

	return processor.server.Start(mux)
}
