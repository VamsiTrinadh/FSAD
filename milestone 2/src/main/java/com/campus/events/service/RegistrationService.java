package com.campus.events.service;

import com.campus.events.entity.Event;
import com.campus.events.entity.Registration;
import com.campus.events.repository.EventRepository;
import com.campus.events.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;

    @Autowired
    public RegistrationService(RegistrationRepository registrationRepository, EventRepository eventRepository) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
    }

    public Registration registerStudent(Registration registration, Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isPresent()) {
            Event event = eventOpt.get();
            
            // Check capacity
            int currentRegistrations = event.getRegistrations().size();
            if (currentRegistrations >= event.getMaxCapacity()) {
                throw new RuntimeException("Event is already at full capacity.");
            }
            
            // Check if already registered
            if (registrationRepository.existsByEventIdAndStudentEmail(eventId, registration.getStudentEmail())) {
                throw new RuntimeException("Student with this email is already registered for this event.");
            }

            registration.setEvent(event);
            return registrationRepository.save(registration);
        }
        throw new RuntimeException("Event not found");
    }

    public List<Registration> getRegistrationsForEvent(Long eventId) {
        return registrationRepository.findByEventId(eventId);
    }
}
