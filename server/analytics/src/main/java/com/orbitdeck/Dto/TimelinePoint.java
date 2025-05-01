package com.orbitdeck.Dto;

public class TimelinePoint {
    private String day;
    private long count;

    public TimelinePoint(String day, long count) {
        this.day = day;
        this.count = count;
    }

    public String getDay() {
        return this.day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public long getCount() {
        return this.count;
    }

    public void setCount(long count) {
        this.count = count;
    }

}
