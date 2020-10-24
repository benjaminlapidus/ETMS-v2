package com.nyeb.etms.controller;

import com.nyeb.etms.entity.Library;
import com.nyeb.etms.service.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class LibraryController {

    @Autowired
    private LibraryService service;

    @PostMapping("/api/addLibrary")
    public Library addLibrary(@RequestBody Library library) {
        return service.saveLibrary(library);
    }

    @GetMapping("/api/getAllLibraries")
    public List<Library> findAllLibraries() {
        return service.getLibraries();
    }

    @GetMapping("/api/getLibraryById/{id}")
    public Library findLibraryById(@PathVariable int id) {
        return service.getLibraryById(id);
    }

    @PutMapping("/api/updateLibrary")
    public Library updateLibrary(@RequestBody Library library) {
        return service.updateLibrary(library);
    }

    @DeleteMapping("/api/deleteLibraryById/{id}")
    public String deleteLibrary(@PathVariable int id) {
        return service.deleteLibrary(id);
    }
}