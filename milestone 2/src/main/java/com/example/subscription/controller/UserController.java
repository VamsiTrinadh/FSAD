package com.example.subscription.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.subscription.model.User;
import com.example.subscription.repository.UserRepository;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository repo;

   @PostMapping("/signup")
public User signup(@RequestBody User user) {
    return repo.save(user);
}

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        User existing = repo.findByUsername(user.getUsername());

        if(existing != null && existing.getPassword().equals(user.getPassword())) {
            return "SUCCESS";
        }
        return "FAIL";
    }

    @PostMapping("/subscribe")
    public User subscribe(@RequestBody User user) {
        User existing = repo.findByUsername(user.getUsername());
        existing.setPlan(user.getPlan());
        return repo.save(existing);
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return repo.findAll();
    }
    @GetMapping("/profile/{username}")
public User getProfile(@PathVariable String username) {
    return repo.findByUsername(username);
}

}