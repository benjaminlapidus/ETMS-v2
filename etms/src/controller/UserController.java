package com.nyeb.etms.controller;

import com.nyeb.etms.entity.User;
import com.nyeb.etms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/api/addUser")
    public User addUser(@RequestBody User user) {
        return service.saveUser(user);
    }

    @GetMapping("/api/getAllUsers")
    public List<User> findAllUsers() {
        return service.getUsers();
    }

    @GetMapping("/api/getUserById/{id}")
    public User findUserById(@PathVariable int id) {
        return service.getUserById(id);
    }

    @GetMapping("/api/getUserBySession/{session}")
    public User findUserBySession(@PathVariable String session) {
        return service.getUserBySession(session);
    }

    @PutMapping("/api/updateUser")
    public User updateUser(@RequestBody User user) {
        return service.updateUser(user);
    }

    @DeleteMapping("/api/deleteUserById/{id}")
    public String deleteUser(@PathVariable int id) {
        return service.deleteUser(id);
    }
}