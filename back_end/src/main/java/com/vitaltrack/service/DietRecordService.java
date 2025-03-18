package com.vitaltrack.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vitaltrack.dao.DietRecordDao;
import com.vitaltrack.mapper.DietRecordMapper;

@Service
public class DietRecordService {
    private final DietRecordMapper dietRecordMapper;

    @Autowired
    public DietRecordService(DietRecordMapper dietRecordMapper) {
        this.dietRecordMapper = dietRecordMapper;
    }

    /**
     * Save a single diet record
     */
    public DietRecordDao saveDietRecord(DietRecordDao dietRecord) {
        dietRecordMapper.insertDietRecord(dietRecord); // Save to DB via MyBatis
        System.out.println("Generated record ID: " + dietRecord.getRecordId());
        return dietRecord; // Return the saved record (assuming fields like ID are auto-populated)
    }

    /**
     * Fetch meals by member number (used by the /api/meals/{memNo} endpoint)
     */
    public List<DietRecordDao> getMealsByMemberNumber(int memNo) {
        // Call the MyBatis mapper to fetch records by memNo
        return dietRecordMapper.findDietRecordsByMemNo(memNo);
    }

    // In DietRecordService.java
    public List<DietRecordDao> getMealsByMemberAndDate(int memNo, LocalDate date) {
        // Implement or call mapper method to get meals for specific date
        // You'll need to add this method to your mapper
        return dietRecordMapper.findDietRecordsByMemNoAndDate(memNo, date);
    }

    public Map<String, Object> getMacronutrientsByMemberAndDate(int memNo, LocalDate date) {
        // Get meals for the specific date
        List<DietRecordDao> meals = getMealsByMemberAndDate(memNo, date);

        // Calculate totals
        double totalProtein = 0.0;
        double totalCarbs = 0.0;
        double totalFat = 0.0;

        for (DietRecordDao meal : meals) {
            if (meal.getProtein() != null) totalProtein += meal.getProtein();
            if (meal.getCarbs() != null) totalCarbs += meal.getCarbs();
            if (meal.getFat() != null) totalFat += meal.getFat();
        }

        // Create response
        Map<String, Object> result = new HashMap<>();
        Map<String, Double> consumed = new HashMap<>();
        consumed.put("protein", totalProtein);
        consumed.put("carbs", totalCarbs);
        consumed.put("fat", totalFat);

        result.put("consumed", consumed);
        // Add target values (from user settings or calculated)

        return result;
    }

    /**
     * Check if a meal exists by id
     */
    public boolean checkIfMealExists(int recordId) {
        // Using the mapper to check if the record exists
        DietRecordDao record = dietRecordMapper.findDietRecordById(recordId);
        return record != null;
    }

    /**
     * Delete a meal by id
     */
    public boolean deleteMeal(int recordId) {
        System.out.println("Service: Deleting meal with ID: " + recordId);
        try {
            // Using the mapper to delete the record
            int rowsAffected = dietRecordMapper.deleteDietRecordByRecordId(recordId);
            System.out.println("Rows affected by delete: " + rowsAffected);
            return rowsAffected > 0;
        } catch (Exception e) {
            System.err.println("Error in deleteMeal: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}