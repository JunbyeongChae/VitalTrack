package com.vitaltrack.logic;

import com.vitaltrack.dao.WorkoutDao;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Log4j2
@Service
public class WorkoutLogic {
    @Autowired
    private WorkoutDao workoutDao;

    //곧 있을 운동 일정 1개
    public Map<String, Object> getFutureWorkout(Map<String, Object> pmap) {
        Map<String, Object> rmap = null;
        rmap = workoutDao.getFutureWorkout(pmap);
        return rmap;
    }

    //가장 최근에 한 운동 1개
    public Map<String, Object> getLastWorkout(Map<String, Object> pmap) {
        Map<String, Object> rmap = null;
        rmap = workoutDao.getLastWorkout(pmap);
        return rmap;
    }

    //최근 7일간 한 운동
    public List<Map<String, Object>> getLast7Workouts(Map<String, Object> pmap) {
        List<Map<String, Object>> sList = null;
        sList = workoutDao.getLast7Workouts(pmap);
        return sList;
    }

    //전체 운동 일정 조회
    public List<Map<String, Object>> getScheduleList(Map<String, Object> pmap) {
        List<Map<String, Object>> sList = null;
        sList = workoutDao.getScheduleList(pmap);
        return sList;
    }

    //운동 일정 추가
    public int insertSchedule(Map<String, Object> pmap) {
        int result = -1;
        result = workoutDao.insertSchedule(pmap);
        return result;
    }

    //운동 일정 수정
    public int updateSchedule(Map<String, Object> pmap) {
        int result = -1;
        result = workoutDao.updateSchedule(pmap);
        return result;
    }

    //운동 완료 체크 -> 일정 업데이트
    public int updateIsFinished(Map<String, Object> pmap) {
        int result = -1;
        result = workoutDao.updateIsFinished(pmap);
        return result;
    }

    //운동 일정 삭제
    public int deleteSchedule(Map<String, Object> pmap) {
        int result = -1;
        result = workoutDao.deleteSchedule(pmap);
        return result;
    }

}
