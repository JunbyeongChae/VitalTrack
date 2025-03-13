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
        return dietRecord; // Return the saved record (assuming fields like ID are auto-populated)
    }


    // Fetch meals by member number (used by the /api/meals/{memNo} endpoint)
    public List<DietRecordDao> getMealsByMemberNumber(int memNo) {
        // Call the MyBatis mapper to fetch records by memNo
        return dietRecordMapper.findDietRecordsByMemNo(memNo);
    }
}
