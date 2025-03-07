package com.vitaltrack.repository;

import com.vitaltrack.model.Diet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DietRepository extends JpaRepository<Diet, Long> {
    List<Diet> findByMemNo(String memNo);
}
