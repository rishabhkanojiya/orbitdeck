package com.orbitdeck.repository;

import com.orbitdeck.Dto.TimelinePoint;
import com.orbitdeck.model.EventLog;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EventLogRepository extends JpaRepository<EventLog, Long> {

    @Query("SELECT e FROM EventLog e WHERE e.userEmail = :userEmail ORDER BY e.timestamp DESC")
    List<EventLog> findRecentByUserEmail(String userEmail, Pageable pageable);

    default List<EventLog> findRecentByUserEmail(String userEmail, int limit) {
        return findRecentByUserEmail(userEmail, PageRequest.of(0, limit));
    }

    long countByStatusAndUserEmail(String status, String userEmail);

    @Query("SELECT e.repository, COUNT(e) FROM EventLog e WHERE e.userEmail = :userEmail AND e.repository IS NOT NULL GROUP BY e.repository ORDER BY COUNT(e) DESC")
    List<Object[]> findTopRepositoriesByUser(String userEmail, Pageable pageable);

    @Query("SELECT e.component, COUNT(e) FROM EventLog e WHERE e.userEmail = :userEmail AND e.component IS NOT NULL GROUP BY e.component ORDER BY COUNT(e) DESC")
    List<Object[]> findTopComponentsByUser(String userEmail, Pageable pageable);

    @Query(value = "SELECT DATE_TRUNC(:interval, timestamp) AS time_point, COUNT(*) FROM events WHERE user_email = :userEmail GROUP BY time_point ORDER BY time_point", nativeQuery = true)
    List<Object[]> getEventTimelineByUserAndInterval(String interval, String userEmail);

    @Query("SELECT e FROM EventLog e WHERE LOWER(e.status) IN ('failed', 'crashed') AND e.userEmail = :userEmail ORDER BY e.timestamp DESC")
    List<EventLog> findErrorEventsByUser(String userEmail, Pageable pageable);

    default List<EventLog> findRecentErrorsByUser(String userEmail, int limit) {
        return findErrorEventsByUser(userEmail, Pageable.ofSize(limit));
    }
}
