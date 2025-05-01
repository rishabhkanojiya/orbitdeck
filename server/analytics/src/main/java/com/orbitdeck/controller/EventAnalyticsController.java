package com.orbitdeck.controller;

import com.orbitdeck.Dto.AnalyticsSummary;
import com.orbitdeck.Dto.ComponentUsage;
import com.orbitdeck.Dto.TimelinePoint;
import com.orbitdeck.model.EventLog;
import com.orbitdeck.service.AnalyticsService;
import com.orbitdeck.service.EventLoggingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventAnalyticsController {

    @Autowired
    private EventLoggingService eventLoggingService;

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/recent")
    public List<EventLog> getRecentEvents() {
        return eventLoggingService.getRecentEvents(20);
    }

    @GetMapping("/stats")
    public AnalyticsSummary getStats() {
        return analyticsService.getSummary();
    }

    @GetMapping("/component/usage")
    public List<ComponentUsage> getComponentUsage() {
        return analyticsService.getTopComponents(10);
    }

    @GetMapping("/timeline")
    public List<TimelinePoint> getTimeline() {
        return analyticsService.getEventTimeline();
    }

    @GetMapping("/errors")
    public List<EventLog> getErrors() {
        return analyticsService.getRecentErrors(20);
    }

}
