package com.nyeb.etms.repository;

import com.nyeb.etms.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment,Integer> {
    List<Assignment> findByUsername(String username);
}