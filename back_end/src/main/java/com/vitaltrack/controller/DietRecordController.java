package com.vitaltrack.controller;

import com.vitaltrack.model.DietRecord;
import com.vitaltrack.service.DietRecordService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Log4j2
@RestController
@RequestMapping("/api")
public class DietRecordController {

    private final DietRecordService dietRecordService;

    public DietRecordController(DietRecordService dietRecordService) {
        this.dietRecordService = dietRecordService;
    }

    @PostMapping("/save-meal/{memNo}")
    public ResponseEntity<String> saveMeal(
            @PathVariable int memNo,
            @RequestBody DietRecord dietRecord) {
        try {
            // Set required values
            dietRecord.setMemNo(memNo);
            dietRecord.setDietDate(dietRecord.getDietDate() != null ? dietRecord.getDietDate() : LocalDate.now());

            // Save diet record
            dietRecordService.saveDietRecord(dietRecord);
            return ResponseEntity.status(201).body("Meal saved successfully!");
        } catch (IllegalArgumentException e) {
            log.error("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("An error occurred while saving the meal.");
        }
    }
}