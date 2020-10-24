package com.nyeb.etms.repository;

import com.nyeb.etms.entity.Log;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LogRepository extends JpaRepository<Log,Integer> {
    List<Log> findByUsername(String username);
}