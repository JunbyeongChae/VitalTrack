package com.vitaltrack.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vitaltrack.dao.DietRecordDao;

@Mapper
public interface DietRecordMapper {
    // Existing methods
    void insertDietRecord(DietRecordDao dietRecord);
    List<DietRecordDao> findDietRecordsByMemNo(int memNo);

    // Find record method
    DietRecordDao findDietRecordById(int recordId);

    // Delete method - implementation will be in XML mapper
    int deleteDietRecordByRecordId(@Param("recordId") int recordId);

    List<DietRecordDao> findDietRecordsByMemNoAndDate( int memNo, LocalDate date);

    /**
     * Update the water intake for a specific member and date
     */
    void updateWaterIntake(int memNo, String dietDate, int waterIntake);
}