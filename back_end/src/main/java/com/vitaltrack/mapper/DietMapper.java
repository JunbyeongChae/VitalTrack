package com.vitaltrack.mapper;

import com.vitaltrack.model.Diet;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface DietMapper {

    @Select("SELECT * FROM diet WHERE mem_no = #{memNo}")
    List<Diet> findByMemNo(String memNo);

    @Insert("INSERT INTO diet (mem_no, date, diet_kcal, diet_menu) VALUES (#{memNo}, #{date}, #{dietKcal}, #{dietMenu})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insertDiet(Diet diet);
}
