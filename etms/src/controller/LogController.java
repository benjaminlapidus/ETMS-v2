package com.nyeb.etms.controller;

import com.nyeb.etms.entity.Log;
import com.nyeb.etms.service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class LogController {

    @Autowired
    private LogService service;

    @PostMapping("/api/addLog")
    public Log addLog(@RequestBody Log log) {
        return service.saveLog(log);
    }

    @GetMapping("/api/getAllLogs")
    public List<Log> findAllLogs() {
        return service.getLogs();
    }

    @GetMapping("/api/getLogById/{id}")
    public Log findLogById(@PathVariable int id) {
        return service.getLogById(id);
    }

    @GetMapping("/api/getLogByUsername/{username}")
    public List<Log> findLogByUsername(@PathVariable String username) {
        return service.getLogsByUsername(username);
    }

    @PutMapping("/api/updateLog")
    public Log updateLog(@RequestBody Log log) {
        return service.updateLog(log);
    }

    @DeleteMapping("/api/deleteLogById/{id}")
    public String deleteLog(@PathVariable int id) {
        return service.deleteLog(id);
    }
}