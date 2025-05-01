package com.orbitdeck.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.orbitdeck.Dto.EventPayload;
import com.orbitdeck.model.EventLog;
import com.orbitdeck.repository.EventLogRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class EventLoggingService {

    @Autowired
    private EventLogRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    public void log(EventPayload event) {
        EventLog log = new EventLog();
        log.setEventType(event.getEventType());
        log.setDeploymentId(event.getDeploymentId());
        log.setComponentId(event.getComponentId());
        log.setComponent(event.getComponent());
        log.setRepository(event.getRepository());
        log.setStatus(event.getStatus());
        log.setUserEmail(event.getUser());
        log.setTimestamp(Instant.ofEpochSecond(event.getTimestamp()));

        try {
            log.setMeta(objectMapper.writeValueAsString(event.getMeta()));
        } catch (JsonProcessingException e) {
            log.setMeta("{\"error\":\"failed to serialize meta\"}");
        }

        repository.save(log);
    }

    public List<EventLog> getRecentEvents(int limit) {
        return repository.findRecent(limit);
    }

}
