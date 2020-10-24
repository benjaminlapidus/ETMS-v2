package com.nyeb.etms.controller;

import com.nyeb.etms.entity.Featured;
import com.nyeb.etms.service.FeaturedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FeaturedController {

    @Autowired
    private FeaturedService service;

    @PostMapping("/api/addFeatured")
    public Featured addFeatured(@RequestBody Featured feature) {
        return service.saveFeatured(feature);
    }

    @GetMapping("/api/getAllFeatured")
    public List<Featured> findAllFeatures() {
        return service.getFeatures();
    }

    @GetMapping("/api/getFeaturedById/{id}")
    public Featured findFeaturedById(@PathVariable int id) {
        return service.getFeaturedById(id);
    }

    @PutMapping("/api/updateFeatured")
    public Featured updateFeatured(@RequestBody Featured feature) {
        return service.updateFeatured(feature);
    }

    @DeleteMapping("/api/deleteFeaturedById/{id}")
    public String deleteFeatured(@PathVariable int id) {
        return service.deleteFeatured(id);
    }
}