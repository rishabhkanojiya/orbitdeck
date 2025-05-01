package publish

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/rs/zerolog/log"
)

const DeploymentEventChannel = "orbitdeck:events"

type EventPayload struct {
	EventType    string `json:"event_type"`
	DeploymentID int64  `json:"deployment_id"`
	ComponentID  int64  `json:"component_id,omitempty"`
	Component    string `json:"component,omitempty"`
	Repository   string `json:"repository,omitempty"`
	Status       string `json:"status,omitempty"`
	User         string `json:"user,omitempty"`
	Meta         any    `json:"meta,omitempty"`
	Timestamp    int64  `json:"timestamp"`
}

func (r *RedisEventPublisher) PublishDeploymentEvent(ctx context.Context, event EventPayload) error {
	payload, err := json.Marshal(event)
	if err != nil {
		return fmt.Errorf("failed to marshal event payload: %w", err)
	}

	err = r.redisClient.Publish(ctx, DeploymentEventChannel, payload).Err()
	if err != nil {
		log.Error().
			Err(err).
			Str("channel", DeploymentEventChannel).
			Interface("event", event).
			Msg("Failed to publish deployment event")
		return err
	}

	log.Debug().
		Str("channel", DeploymentEventChannel).
		Interface("event", event).
		Msg("Successfully published deployment event")

	return nil
}
