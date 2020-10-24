package com.nyeb.etms.repository;

import com.nyeb.etms.entity.Featured;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeaturedRepository extends JpaRepository<Featured,Integer> {
}