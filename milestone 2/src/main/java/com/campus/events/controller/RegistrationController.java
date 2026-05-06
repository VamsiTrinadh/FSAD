package com.campus.events.controller;

import com.campus.events.entity.Event;
import com.campus.events.entity.Registration;
import com.campus.events.service.EmailService;
import com.campus.events.service.EventService;
import com.campus.events.service.RegistrationService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/register")
public class RegistrationController {

    private final RegistrationService registrationService;
    private final EventService eventService;
    private final EmailService emailService;

    @Autowired
    public RegistrationController(RegistrationService registrationService, EventService eventService, EmailService emailService) {
        this.registrationService = registrationService;
        this.eventService = eventService;
        this.emailService = emailService;
    }

    @GetMapping("/{eventId}")
    public String showRegistrationForm(@PathVariable Long eventId, Model model) {
        Event event = eventService.getEventById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid event Id:" + eventId));
        
        Registration registration = new Registration();
        model.addAttribute("event", event);
        model.addAttribute("registration", registration);
        return "registration-form";
    }

    @PostMapping("/{eventId}")
    public String processRegistration(
            @PathVariable Long eventId,
            @Valid @ModelAttribute("registration") Registration registration,
            BindingResult result,
            Model model,
            HttpSession session) {

        if (result.hasErrors()) {
            Event event = eventService.getEventById(eventId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid event Id:" + eventId));
            model.addAttribute("event", event);
            return "registration-form";
        }

        try {
            // Check capacity and existing registration before sending OTP
            Event event = eventService.getEventById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
            if (event.getRegistrations().size() >= event.getMaxCapacity()) {
                throw new RuntimeException("Event is already at full capacity.");
            }
            
            // Generate OTP and send email
            String otp = emailService.generateOTP();
            emailService.sendOTP(registration.getStudentEmail(), otp);
            
            // Store registration data in session
            session.setAttribute("pendingRegistration", registration);
            session.setAttribute("pendingEventId", eventId);
            session.setAttribute("registrationOtp", otp);
            
            return "redirect:/register/verify-otp";
        } catch (RuntimeException e) {
            Event event = eventService.getEventById(eventId).orElse(null);
            model.addAttribute("event", event);
            model.addAttribute("errorMessage", e.getMessage());
            return "registration-form";
        }
    }

    @GetMapping("/verify-otp")
    public String showOtpVerificationForm(HttpSession session) {
        if (session.getAttribute("pendingRegistration") == null) {
            return "redirect:/";
        }
        return "otp-verification";
    }

    @PostMapping("/verify-otp")
    public String processOtpVerification(@RequestParam("otp") String otp, HttpSession session, Model model, RedirectAttributes redirectAttributes) {
        Registration registration = (Registration) session.getAttribute("pendingRegistration");
        Long eventId = (Long) session.getAttribute("pendingEventId");
        String sessionOtp = (String) session.getAttribute("registrationOtp");

        if (registration == null || eventId == null || sessionOtp == null) {
            return "redirect:/";
        }

        if (!sessionOtp.equals(otp)) {
            model.addAttribute("errorMessage", "Invalid OTP. Please try again.");
            return "otp-verification";
        }

        try {
            Registration savedRegistration = registrationService.registerStudent(registration, eventId);
            
            // Clear session attributes
            session.removeAttribute("pendingRegistration");
            session.removeAttribute("pendingEventId");
            session.removeAttribute("registrationOtp");
            
            redirectAttributes.addFlashAttribute("registration", savedRegistration);
            return "redirect:/register/success";
        } catch (RuntimeException e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "otp-verification";
        }
    }

    @GetMapping("/success")
    public String showSuccessPage(Model model) {
        if (!model.containsAttribute("registration")) {
            return "redirect:/";
        }
        return "registration-success";
    }
}
