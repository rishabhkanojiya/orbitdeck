package worker

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/hibiken/asynq"
	"github.com/rs/zerolog/log"
)

const TaskUninstallHelm = "task:uninstall_helm"

type PayloadUninstallHelm struct {
	Id int64 `json:"id"`
}

func (distributor *RedisTaskDistributor) DistributeTaskUninstallHelm(
	ctx context.Context,
	payload *PayloadUninstallHelm,
	opts ...asynq.Option,
) error {
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal task payload: %w", err)
	}

	task := asynq.NewTask(TaskUninstallHelm, jsonPayload, opts...)
	info, err := distributor.client.EnqueueContext(ctx, task)
	if err != nil {
		return fmt.Errorf("failed to enqueue task: %w", err)
	}

	log.Info().Str("type", task.Type()).Bytes("payload", task.Payload()).
		Str("queue", info.Queue).Int("max_retry", info.MaxRetry).Msg("enqueued task")
	return nil
}

func (processor *RedisTaskProcessor) ProcessTaskUninstallHelm(ctx context.Context, task *asynq.Task) error {
	var payload PayloadUninstallHelm
	if err := json.Unmarshal(task.Payload(), &payload); err != nil {
		return fmt.Errorf("failed to unmarshal payload: %w", asynq.SkipRetry)
	}

	deployment, err := processor.store.GetDeployment(ctx, payload.Id)

	if err != nil {
		return err
	}

	log.Debug().Interface("deployment", deployment).Msg("deployment")

	err = processor.helmSvc.Uninstall(deployment)

	if err != nil {
		return fmt.Errorf("failed to Uninstall Helm: %w", err)
	}

	err = processor.store.DeleteDeployment(ctx, deployment.ID)
	if err != nil {
		log.Error().Str("type", task.Type()).Bytes("payload", task.Payload()).
			Str("name", deployment.Name).Msg("failed to delete deployment from DB")
	}

	log.Info().Str("type", task.Type()).Bytes("payload", task.Payload()).
		Str("name", deployment.Name).Msg("processed task")
	return nil
}
