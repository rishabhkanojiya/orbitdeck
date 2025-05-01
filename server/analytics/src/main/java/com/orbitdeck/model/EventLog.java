package com.orbitdeck.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "events")
public class EventLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String eventType;
    private Long deploymentId;
    private Long componentId;
    private String component;
    private String repository;
    private String status;
    private String userEmail;

    @Column(columnDefinition = "TEXT")
    private String meta;

    private Instant timestamp;

    public EventLog() {
    }

    public EventLog(Long id, String eventType, Long deploymentId, Long componentId, String component, String repository,
            String status, String userEmail, String meta, Instant timestamp) {
        this.id = id;
        this.eventType = eventType;
        this.deploymentId = deploymentId;
        this.componentId = componentId;
        this.component = component;
        this.repository = repository;
        this.status = status;
        this.userEmail = userEmail;
        this.meta = meta;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEventType() {
        return this.eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public Long getDeploymentId() {
        return this.deploymentId;
    }

    public void setDeploymentId(Long deploymentId) {
        this.deploymentId = deploymentId;
    }

    public Long getComponentId() {
        return this.componentId;
    }

    public void setComponentId(Long componentId) {
        this.componentId = componentId;
    }

    public String getComponent() {
        return this.component;
    }

    public void setComponent(String component) {
        this.component = component;
    }

    public String getRepository() {
        return this.repository;
    }

    public void setRepository(String repository) {
        this.repository = repository;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUserEmail() {
        return this.userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getMeta() {
        return this.meta;
    }

    public void setMeta(String meta) {
        this.meta = meta;
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

}
