package com.vitaltrack.dao;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface DietRecordDaoMapper {
  // Existing methods
  void insertDietRecord(DietRecordDao dietRecord);

  List<DietRecordDao> findDietRecordsByMemNo(int memNo);

  // Find record method
  DietRecordDao findDietRecordById(int recordId);

  // Delete method - implementation will be in XML mapper
  int deleteDietRecordByRecordId(@Param("recordId") int recordId);

  List<DietRecordDao> findDietRecordsByMemNoAndDate(@Param("memNo") int memNo,
      @Param("date") LocalDate date);

  /**
   * Update the water intake for a specific member and date
   */
  void updateWaterIntake(@Param("memNo") int memNo,
      @Param("dietDate") String dietDate,
      @Param("waterIntake") int waterIntake);

}