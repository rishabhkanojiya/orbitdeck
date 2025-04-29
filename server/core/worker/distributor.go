package worker

import (
	"context"

	"github.com/hibiken/asynq"
)

type TaskDistributor interface {
	DistributeTaskGenerateHelm(
		ctx context.Context,
		payload *PayloadGenerateHelm,
		opts ...asynq.Option,
	) (*asynq.TaskInfo, error)
	DistributeTaskUninstallHelm(
		ctx context.Context,
		payload *PayloadUninstallHelm,
		opts ...asynq.Option,
	) error
}

type RedisTaskDistributor struct {
	client *asynq.Client
}

func NewRedisTaskDistributor(redisOpt asynq.RedisClientOpt) TaskDistributor {
	client := asynq.NewClient(redisOpt)
	return &RedisTaskDistributor{
		client: client,
	}
}
