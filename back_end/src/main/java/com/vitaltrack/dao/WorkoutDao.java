package com.vitaltrack.dao;

import lombok.extern.log4j.Log4j2;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Log4j2
@Repository
public class WorkoutDao {
    @Autowired
    private SqlSessionTemplate sqlSessionTemplate;


    public List<Map<String, Object>> scheduleList() {
        log.info("scheduleList 실행 성공.");
        List<Map<String, Object>> sList = null;
        sList = sqlSessionTemplate.selectList("scheduleList");
        return sList;
    }
}
