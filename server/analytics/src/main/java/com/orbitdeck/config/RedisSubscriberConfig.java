package com.orbitdeck.config;

import com.orbitdeck.subscriber.DeploymentEventSubscriber;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;

@Configuration
public class RedisSubscriberConfig {

    private final RedisConnectionFactory connectionFactory;
    private final DeploymentEventSubscriber subscriber;

    public RedisSubscriberConfig(RedisConnectionFactory connectionFactory, DeploymentEventSubscriber subscriber) {
        this.connectionFactory = connectionFactory;
        this.subscriber = subscriber;
    }

    @Bean
    public RedisMessageListenerContainer redisContainer() {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(subscriber, new PatternTopic("orbitdeck:events"));
        return container;
    }
}
