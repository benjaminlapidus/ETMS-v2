package com.nyeb.etms.repository;

import com.nyeb.etms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Integer> {
    User findBySession(String session);
}