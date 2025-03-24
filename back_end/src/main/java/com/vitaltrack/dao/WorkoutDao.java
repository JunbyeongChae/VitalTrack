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

    //곧 있을 운동 일정 1개
    public Map<String, Object> getFutureWorkout(Map<String, Object> pmap) {
        log.info("getFutureWorkout 실행 성공.");
        Map<String, Object> rmap = null;
        rmap = sqlSessionTemplate.selectOne("getFutureWorkout", pmap);
        return rmap;
    }

    //가장 최근에 한 운동 1개
    public Map<String, Object> getLastWorkout(Map<String, Object> pmap) {
        log.info("getLastWorkout 실행 성공.");
        Map<String, Object> rmap = null;
        rmap = sqlSessionTemplate.selectOne("getLastWorkout", pmap);
        return rmap;
    }

    //최근 7일간 한 운동
    public List<Map<String, Object>> getLast7Workouts(Map<String, Object> pmap) {
        log.info("getLast7Workouts 실행 성공.");
        List<Map<String, Object>> sList = null;
        sList = sqlSessionTemplate.selectList("getLast7Workouts", pmap);
        return sList;
    }

    //전체 운동 일정 조회
    public List<Map<String, Object>> getScheduleList(Map<String, Object> pmap) {
        log.info("getScheduleList 실행 성공.");
        List<Map<String, Object>> sList = null;
        sList = sqlSessionTemplate.selectList("getScheduleList", pmap);
        return sList;
    }

    //운동 일정 추가
    public int insertSchedule(Map<String, Object> pmap) {
        log.info("scheduleInsert 실행 성공.");
        int result = -1;
        result = sqlSessionTemplate.insert("insertSchedule", pmap);
        return result;
    }

    //운동 일정 수정
    public int updateSchedule(Map<String, Object> pmap) {
        log.info("scheduleUpdate 실행 성공.");
        int result = -1;
        result = sqlSessionTemplate.update("updateSchedule", pmap);
        return result;
    }

    //운동 완료 체크 -> 일정 업데이트
    public int updateIsFinished(Map<String, Object> pmap) {
        log.info("updateIsFinished 실행 성공.");
        int result = -1;
        result = sqlSessionTemplate.update("updateIsFinished", pmap);
        return result;
    }

    //운동 일정 삭제
    public int deleteSchedule(Map<String, Object> pmap) {
        log.info("scheduleDelete 실행 성공.");
        int result = -1;
        result = sqlSessionTemplate.delete("deleteSchedule", pmap);
        return result;
    }

}
