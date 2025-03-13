package com.vitaltrack.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vitaltrack.dao.DietRecordDao;

@Mapper
public interface DietRecordMapper {

    /**
     * Insert a single diet record
     */
    void insertDietRecord(DietRecordDao dietRecord);

    /**
     * Fetch diet records by member number
     */
    List<DietRecordDao> findDietRecordsByMemNo(int memNo);
}
