package com.nyeb.etms.service;

import com.nyeb.etms.entity.Featured;
import com.nyeb.etms.repository.FeaturedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeaturedService {
    @Autowired
    private FeaturedRepository repository;

    public Featured saveFeatured(Featured product) {
        return repository.save(product);
    }

    public List<Featured> getFeatures() {
        return repository.findAll();
    }

    public Featured getFeaturedById(int id) {
        return repository.findById(id).orElse(null);
    }

    public String deleteFeatured(int id) {
        repository.deleteById(id);
        return "Deleted featured post " + id;
    }

    public Featured updateFeatured(Featured feature) {
        Featured existingFeatured = repository.findById(feature.getId()).orElse(null);
        if (existingFeatured != null) {
            existingFeatured.setTitle(feature.getTitle());
            existingFeatured.setLocation(feature.getLocation());
            existingFeatured.setDescription(feature.getDescription());
            existingFeatured.setDate(feature.getDate());
            existingFeatured.setTime(feature.getTime());
            existingFeatured.setUrl(feature.getUrl());
        }
        return repository.save(existingFeatured);
    }


}