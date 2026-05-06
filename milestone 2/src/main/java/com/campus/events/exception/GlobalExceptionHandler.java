package com.campus.events.exception;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public String handleGlobalException(Exception ex, Model model) {
        model.addAttribute("errorMessage", "An unexpected error occurred: " + ex.getMessage());
        return "error";
    }
}
