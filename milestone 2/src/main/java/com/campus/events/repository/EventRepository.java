package com.campus.events.repository;

import com.campus.events.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("SELECT e FROM Event e WHERE " +
           "(:date IS NULL OR e.eventDate = :date) AND " +
           "(:department IS NULL OR e.department = :department) AND " +
           "(:eventType IS NULL OR e.eventType = :eventType)")
    List<Event> findByFilters(@Param("date") LocalDate date, 
                              @Param("department") String department, 
                              @Param("eventType") String eventType);

    List<Event> findByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate date);
}
