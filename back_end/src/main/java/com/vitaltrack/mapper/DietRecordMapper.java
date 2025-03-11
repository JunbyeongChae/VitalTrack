package com.vitaltrack.mapper;

import com.vitaltrack.model.DietRecord;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DietRecordMapper {

    void insertDietRecord(List<DietRecord> records);

    List<DietRecord> findDietRecordsByMemNo(int memNo);

    void deleteDietRecordById(int recordId);
}