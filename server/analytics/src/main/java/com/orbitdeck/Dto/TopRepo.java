package com.orbitdeck.Dto;

public class TopRepo {
    private String name;
    private long count;

    public TopRepo() {
    }

    public TopRepo(String name, long count) {
        this.name = name;
        this.count = count;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getCount() {
        return this.count;
    }

    public void setCount(long count) {
        this.count = count;
    }

}
