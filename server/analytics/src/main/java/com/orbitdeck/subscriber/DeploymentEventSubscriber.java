package com.orbitdeck.subscriber;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.orbitdeck.Dto.EventPayload;
import com.orbitdeck.service.EventLoggingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

@Component
public class DeploymentEventSubscriber implements MessageListener {

    @Autowired
    private EventLoggingService eventLoggingService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String json = new String(message.getBody());
            EventPayload event = objectMapper.readValue(json, EventPayload.class);

            // Save to DB
            eventLoggingService.log(event);
        } catch (Exception e) {
            System.err.println("Failed to process event: " + e.getMessage());
        }
    }
}
