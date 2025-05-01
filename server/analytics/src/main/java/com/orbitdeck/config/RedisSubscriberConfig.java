package com.orbitdeck.config;

import com.orbitdeck.subscriber.DeploymentEventSubscriber;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.*;
import org.springframework.data.redis.listener.*;

@Configuration
public class RedisSubscriberConfig {

    @Autowired
    private RedisConnectionFactory connectionFactory;

    @Autowired
    private DeploymentEventSubscriber subscriber;

    @Bean
    public RedisMessageListenerContainer redisContainer() {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(subscriber, new PatternTopic("orbitdeck:events"));
        return container;
    }
}
