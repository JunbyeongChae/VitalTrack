package com.vitaltrack.mapper;

import com.vitaltrack.model.Diet;
import org.apache.ibatis.annotations.Param;

public interface DietMapper {
    Diet findByMemNo(@Param("memNo") String memNo);
    void insertDiet(Diet diet);
}