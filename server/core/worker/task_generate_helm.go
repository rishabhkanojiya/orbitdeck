package worker

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/hibiken/asynq"
	"github.com/rs/zerolog/log"
)

const TaskGenerateHelm = "task:generate_helm"

type PayloadGenerateHelm struct {
	Id int64 `json:"id"`
}

func (distributor *RedisTaskDistributor) DistributeTaskGenerateHelm(
	ctx context.Context,
	payload *PayloadGenerateHelm,
	opts ...asynq.Option,
) (*asynq.TaskInfo, error) {
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal task payload: %w", err)
	}

	task := asynq.NewTask(TaskGenerateHelm, jsonPayload, opts...)
	info, err := distributor.client.EnqueueContext(ctx, task)
	if err != nil {
		return nil, fmt.Errorf("failed to enqueue task: %w", err)
	}

	log.Info().
		Str("type", task.Type()).
		Bytes("payload", task.Payload()).
		Str("queue", info.Queue).
		Int("max_retry", info.MaxRetry).
		Msg("enqueued task")

	return info, nil
}

func (processor *RedisTaskProcessor) ProcessTaskGenerateHelm(ctx context.Context, task *asynq.Task) error {
	var payload PayloadGenerateHelm
	if err := json.Unmarshal(task.Payload(), &payload); err != nil {
		return fmt.Errorf("failed to unmarshal payload: %w", asynq.SkipRetry)
	}
	deployment, err := processor.store.GetDeploymentObject(ctx, payload.Id)

	if err != nil {
		return err
	}

	err = processor.helmSvc.Deploy(deployment)

	if err != nil {
		return fmt.Errorf("failed to Deploy: %w", err)
	}

	log.Info().Str("type", task.Type()).Bytes("payload", task.Payload()).
		Str("name", deployment.Name).Msg("processed task")
	return nil
}
