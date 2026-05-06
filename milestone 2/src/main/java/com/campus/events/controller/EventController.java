package com.campus.events.controller;

import com.campus.events.entity.Event;
import com.campus.events.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Controller
public class EventController {

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("events", eventService.getUpcomingEvents());
        return "index";
    }

    @GetMapping("/events/{id}")
    public String eventDetails(@PathVariable Long id, Model model) {
        Event event = eventService.getEventById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid event Id:" + id));
        model.addAttribute("event", event);
        return "event-details";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    // Admin endpoints
    @GetMapping("/admin/dashboard")
    public String adminDashboard(
            @RequestParam(required = false) LocalDate date,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String eventType,
            Model model) {
        
        List<Event> events;
        if (date != null || (department != null && !department.isEmpty()) || (eventType != null && !eventType.isEmpty())) {
            events = eventService.searchEvents(date, department.isEmpty() ? null : department, eventType.isEmpty() ? null : eventType);
        } else {
            events = eventService.getAllEvents();
        }
        
        model.addAttribute("events", events);
        return "admin/dashboard";
    }

    @GetMapping("/admin/event/new")
    public String showEventForm(Model model) {
        model.addAttribute("event", new Event());
        return "admin/event-form";
    }

    @PostMapping("/admin/event/save")
    public String saveEvent(@Valid @ModelAttribute("event") Event event, BindingResult result, Model model) {
        if (result.hasErrors()) {
            return "admin/event-form";
        }
        eventService.saveEvent(event);
        return "redirect:/admin/dashboard";
    }

    @GetMapping("/admin/event/edit/{id}")
    public String editEvent(@PathVariable Long id, Model model) {
        Event event = eventService.getEventById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid event Id:" + id));
        model.addAttribute("event", event);
        return "admin/event-form";
    }

    @GetMapping("/admin/event/delete/{id}")
    public String deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return "redirect:/admin/dashboard";
    }

    @GetMapping("/admin/statistics")
    public String statistics(Model model) {
        model.addAttribute("events", eventService.getAllEvents());
        return "admin/statistics";
    }
}
