package com.vitaltrack.service;

import java.util.List;

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