package com.nyeb.etms.service;

import com.nyeb.etms.entity.Log;
import com.nyeb.etms.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogService {
    @Autowired
    private LogRepository repository;

    public Log saveLog(Log product) {
        return repository.save(product);
    }

    public List<Log> getLogs() {
        return repository.findAll();
    }

    public Log getLogById(int id) {
        return repository.findById(id).orElse(null);
    }

    public List<Log> getLogsByUsername(String username) {
        return repository.findByUsername(username);
    }

    public String deleteLog(int id) {
        repository.deleteById(id);
        return "Log deleted | " + id;
    }

    public Log updateLog(Log log) {
        Log existingLog = repository.findById(log.getId()).orElse(null);
        if (existingLog != null) {
            existingLog.setUsername(log.getUsername());
            existingLog.setEntry_status(log.getEntry_status());
            existingLog.setTitle(log.getTitle());
            existingLog.setDate(log.getDate());
            existingLog.setIs_complete(log.getIs_complete());
            existingLog.setProvider(log.getProvider());
            existingLog.setType(log.getType());
            existingLog.setHours(log.getHours());
            existingLog.setAttachment(log.getAttachment());
            existingLog.setNotes(log.getNotes());
        }
        return repository.save(existingLog);
    }


}