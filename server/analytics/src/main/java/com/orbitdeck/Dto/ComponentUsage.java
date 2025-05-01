package com.orbitdeck.Dto;

public class ComponentUsage {
    private String component;
    private long count;

    public ComponentUsage(String component, long count) {
        this.component = component;
        this.count = count;
    }

    public String getComponent() {
        return this.component;
    }

    public void setComponent(String component) {
        this.component = component;
    }

    public long getCount() {
        return this.count;
    }

    public void setCount(long count) {
        this.count = count;
    }

}