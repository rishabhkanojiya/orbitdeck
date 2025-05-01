package com.orbitdeck.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.orbitdeck.Dto.AnalyticsSummary;
import com.orbitdeck.Dto.ComponentUsage;
import com.orbitdeck.Dto.TimelinePoint;
import com.orbitdeck.Dto.TopRepo;
import com.orbitdeck.model.EventLog;
import com.orbitdeck.repository.EventLogRepository;

@Service
public class AnalyticsService {

    @Autowired
    private EventLogRepository repository;

    public AnalyticsSummary getSummary() {
        long total = repository.count();
        long active = repository.countByStatus("installed");

        List<TopRepo> repos = repository.findTopRepositories(PageRequest.of(0, 5)).stream()
                .map(r -> new TopRepo((String) r[0], (Long) r[1]))
                .toList();

        return new AnalyticsSummary(total, active, repos);
    }

    public List<ComponentUsage> getTopComponents(int limit) {
        return repository.findTopComponents(PageRequest.of(0, limit)).stream()
                .map(r -> new ComponentUsage((String) r[0], (Long) r[1]))
                .toList();
    }

    public List<TimelinePoint> getEventTimeline() {
        return repository.getEventTimeline().stream()
                .map(r -> new TimelinePoint(r[0].toString(), (Long) r[1]))
                .toList();
    }

    public List<EventLog> getRecentErrors(int limit) {
        return repository.findRecentErrors(limit);
    }
}
