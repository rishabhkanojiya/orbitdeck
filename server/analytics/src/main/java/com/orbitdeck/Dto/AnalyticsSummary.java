package com.orbitdeck.Dto;

import java.util.List;

public class AnalyticsSummary {
    private long total;
    private long active;
    private List<TopRepo> topRepos;

    public AnalyticsSummary() {
    }

    public AnalyticsSummary(long total, long active, List<TopRepo> topRepos) {
        this.total = total;
        this.active = active;
        this.topRepos = topRepos;
    }

    public long getTotal() {
        return this.total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getActive() {
        return this.active;
    }

    public void setActive(long active) {
        this.active = active;
    }

    public List<TopRepo> getTopRepos() {
        return this.topRepos;
    }

    public void setTopRepos(List<TopRepo> topRepos) {
        this.topRepos = topRepos;
    }

}
