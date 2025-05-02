package com.orbitdeck.repository;

import com.orbitdeck.model.EventLog;

import io.lettuce.core.dynamic.annotation.Param;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EventLogRepository extends JpaRepository<EventLog, Long> {

    @Query("SELECT e FROM EventLog e ORDER BY e.timestamp DESC")
    List<EventLog> findRecent(Pageable pageable);

    default List<EventLog> findRecent(int limit) {
        return findRecent(PageRequest.of(0, limit));
    }

    long countByStatus(String status);

    @Query("SELECT e.repository, COUNT(e) FROM EventLog e WHERE e.repository IS NOT NULL GROUP BY e.repository ORDER BY COUNT(e) DESC")
    List<Object[]> findTopRepositories(Pageable pageable);

    @Query("SELECT e.component, COUNT(e) FROM EventLog e WHERE e.component IS NOT NULL GROUP BY e.component ORDER BY COUNT(e) DESC")
    List<Object[]> findTopComponents(Pageable pageable);

    @Query(value = "SELECT DATE_TRUNC(:interval, timestamp) AS time_point, COUNT(*) " +
            "FROM events " +
            "GROUP BY time_point " +
            "ORDER BY time_point", nativeQuery = true)
    List<Object[]> getEventTimelineByInterval(@Param("interval") String interval);

    @Query("SELECT e FROM EventLog e WHERE LOWER(e.status) IN ('failed', 'crashed') ORDER BY e.timestamp DESC")
    List<EventLog> findErrorEvents(Pageable pageable);

    default List<EventLog> findRecentErrors(int limit) {
        return findErrorEvents(PageRequest.of(0, limit));
    }

}
