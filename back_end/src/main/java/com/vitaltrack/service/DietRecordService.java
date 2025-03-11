package com.vitaltrack.service;

import com.vitaltrack.model.DietRecord;
import com.vitaltrack.mapper.DietRecordMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DietRecordService {

    private final DietRecordMapper dietRecordMapper;

    public DietRecordService(DietRecordMapper dietRecordMapper) {
        this.dietRecordMapper = dietRecordMapper;
    }

    public void saveDietRecord(DietRecord dietRecord) {
        // Validation
        if (dietRecord.getFoodName() == null || dietRecord.getFoodName().isEmpty()) {
            throw new IllegalArgumentException("Food name is required");
        }
        if (dietRecord.getMealType() == null) {
            throw new IllegalArgumentException("Meal type is required");
        }
        if (dietRecord.getDietDate() == null) {
            dietRecord.setDietDate(LocalDate.now()); // Set default to today
        }
        if (dietRecord.getMemo() == null) {
            dietRecord.setMemo(""); // Default memo to empty string
        }

        // Save record
        dietRecordMapper.insertDietRecord(List.of(dietRecord));
    }
}