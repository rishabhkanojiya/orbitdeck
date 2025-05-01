package publish

import (
	"context"

	"github.com/redis/go-redis/v9"
)

type EventPublisher interface {
	PublishDeploymentEvent(ctx context.Context, event EventPayload) error
}

type RedisEventPublisher struct {
	redisClient *redis.Client
}

func NewRedisEventPublisher(redisAddr string) *RedisEventPublisher {
	client := redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})
	return &RedisEventPublisher{redisClient: client}
}
