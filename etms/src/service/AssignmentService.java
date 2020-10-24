package com.nyeb.etms.service;

import com.nyeb.etms.entity.Assignment;
import com.nyeb.etms.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssignmentService {
    @Autowired
    private AssignmentRepository repository;

    public Assignment saveAssignment(Assignment product) {
        return repository.save(product);
    }

    public List<Assignment> getAssignments() {
        return repository.findAll();
    }

    public Assignment getAssignmentById(int id) {
        return repository.findById(id).orElse(null);
    }

    public List<Assignment> getAssignmentsByUsername(String username) {
        return repository.findByUsername(username);
    }

    public String deleteAssignment(int id) {
        repository.deleteById(id);
        return "Assignment Deleted | " + id;
    }

    //TODO: Not sure if this is dangerous - potentially returns null in edge cases
    public Assignment updateAssignment(Assignment assignment) {
        Assignment existingAssignment = repository.findById(assignment.getId()).orElse(null);

        if (existingAssignment != null) {
            existingAssignment.setAssigner_username(assignment.getAssigner_username());
            existingAssignment.setUsername(assignment.getUsername());
            existingAssignment.setTitle(assignment.getTitle());
            existingAssignment.setStatus(assignment.getStatus());
            existingAssignment.setDue_date(assignment.getDue_date());
            existingAssignment.setDate_completed(assignment.getDate_completed());
            existingAssignment.setPriority(assignment.getPriority());
            existingAssignment.setUrl(assignment.getUrl());
            existingAssignment.setAttachment(assignment.getAttachment());
            existingAssignment.setNotes(assignment.getNotes());
        }

        return repository.save(existingAssignment);
    }
}