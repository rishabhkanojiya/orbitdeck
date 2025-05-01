package com.orbitdeck.Dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EventPayload {

    @JsonProperty("event_type")
    private String eventType;

    @JsonProperty("deployment_id")
    private Long deploymentId;

    @JsonProperty("component_id")
    private Long componentId;

    private String component;
    private String repository;
    private String status;
    private String user;
    private Object meta;

    private long timestamp;

    public EventPayload() {
    }

    public EventPayload(String eventType, Long deploymentId, Long componentId, String component, String repository,
            String status, String user, Object meta, long timestamp) {
        this.eventType = eventType;
        this.deploymentId = deploymentId;
        this.componentId = componentId;
        this.component = component;
        this.repository = repository;
        this.status = status;
        this.user = user;
        this.meta = meta;
        this.timestamp = timestamp;
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

    public String getUser() {
        return this.user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public Object getMeta() {
        return this.meta;
    }

    public void setMeta(Object meta) {
        this.meta = meta;
    }

    public long getTimestamp() {
        return this.timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

}