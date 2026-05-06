package com.campus.events.service;

import com.campus.events.entity.Event;
import com.campus.events.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository eventRepository;

    @Autowired
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate.now());
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public Event saveEvent(Event event) {
        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public List<Event> searchEvents(LocalDate date, String department, String eventType) {
        return eventRepository.findByFilters(date, department, eventType);
    }
}
