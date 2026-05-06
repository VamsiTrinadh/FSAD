package com.campus.events.repository;

import com.campus.events.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByEventId(Long eventId);
    boolean existsByEventIdAndStudentEmail(Long eventId, String studentEmail);
}
