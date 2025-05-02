package com.orbitdeck.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    private EventLogRepository eventLogRepository;

    public AnalyticsSummary getSummaryForUser(String userEmail) {
        long active = eventLogRepository.countByStatusAndUserEmail("installed", userEmail);

        List<Object[]> topReposRaw = eventLogRepository.findTopRepositoriesByUser(userEmail, Pageable.ofSize(5));
        List<TopRepo> topRepos = topReposRaw.stream()
                .map(row -> new TopRepo(row[0].toString(), ((Number) row[1]).longValue()))
                .toList();

        return new AnalyticsSummary(0, active, topRepos);
    }

    public List<ComponentUsage> getTopComponentsForUser(String userEmail, int limit) {
        return eventLogRepository.findTopComponentsByUser(userEmail, PageRequest.of(0, limit))
                .stream()
                .map(r -> new ComponentUsage((String) r[0], (Long) r[1]))
                .toList();
    }

    public List<TimelinePoint> getTimelineForUser(String userEmail, String interval) {
        return eventLogRepository.getEventTimelineByUserAndInterval("day", userEmail).stream()
                .map(r -> new TimelinePoint(r[0].toString(), (Long) r[1]))
                .toList();
    }

    public List<EventLog> getRecentEventsForUser(String userEmail, int limit) {
        return eventLogRepository.findRecentByUserEmail(userEmail, limit);
    }

    public List<EventLog> getErrorEventsForUser(String userEmail, int limit) {
        return eventLogRepository.findRecentErrorsByUser(userEmail, limit);
    }

}
