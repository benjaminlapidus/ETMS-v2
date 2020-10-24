package com.nyeb.etms.service;

import com.nyeb.etms.entity.Library;
import com.nyeb.etms.repository.LibraryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LibraryService {
    @Autowired
    private LibraryRepository repository;

    public Library saveLibrary(Library product) {
        return repository.save(product);
    }
    
    public List<Library> getLibraries() {
        return repository.findAll();
    }

    public Library getLibraryById(int id) {
        return repository.findById(id).orElse(null);
    }

    public String deleteLibrary(int id) {
        repository.deleteById(id);
        return "product removed !! " + id;
    }

    public Library updateLibrary(Library library) {
        Library existingLibrary = repository.findById(library.getId()).orElse(null);

        if (existingLibrary != null) {
            existingLibrary.setTitle(library.getTitle());
            existingLibrary.setType(library.getType());
            existingLibrary.setYear(library.getYear());
            existingLibrary.setIs_available(library.getIs_available());
            existingLibrary.setUrl(library.getUrl());
            existingLibrary.setLocation(library.getLocation());
            existingLibrary.setBorrower(library.getBorrower());
        }

        return repository.save(existingLibrary);
    }


}