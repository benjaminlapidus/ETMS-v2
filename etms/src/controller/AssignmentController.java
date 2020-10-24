package com.nyeb.etms.controller;

import com.nyeb.etms.entity.Assignment;
import com.nyeb.etms.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AssignmentController {

    @Autowired
    private AssignmentService service;

    @PostMapping("/api/addAssignment")
    public Assignment addAssignment(@RequestBody Assignment assignment) {
        return service.saveAssignment(assignment);
    }

    @GetMapping("/api/getAllAssignments")
    public List<Assignment> findAllAssignments() {
        return service.getAssignments();
    }

    @GetMapping("/api/getAssignmentById/{id}")
    public Assignment findAssignmentById(@PathVariable int id) {
        return service.getAssignmentById(id);
    }

    @GetMapping("/api/getAssignmentsByUsername/{username}")
    public List<Assignment> findAssignmentByUsername(@PathVariable String username) {
        return service.getAssignmentsByUsername(username);
    }

    @PutMapping("/api/updateAssignment")
    public Assignment updateAssignment(@RequestBody Assignment assignment) {
        return service.updateAssignment(assignment);
    }

    @DeleteMapping("/api/deleteAssignmentById/{id}")
    public String deleteAssignment(@PathVariable int id) {
        return service.deleteAssignment(id);
    }
}