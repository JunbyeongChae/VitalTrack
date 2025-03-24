package com.vitaltrack.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.vitaltrack.logic.WorkoutLogic;
import com.vitaltrack.util.LocalDateTimeAdapter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


@Log4j2
@RestController
@RequestMapping("/api/workout") // /api -> 웹페이지 요청이 아닌 RESTful API 요청임을 명시
public class WorkoutController {

    @Autowired
    private WorkoutLogic workoutLogic;

    //가장 최근에 한 운동 1개
    @GetMapping("/getLastWorkout")
    public String getLastWorkout(@RequestParam Map<String, Object> pmap) {
        Map<String, Object> rmap = null;
        rmap = workoutLogic.getLastWorkout(pmap);
        String temp = null;
        Gson g = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter()) // 커스텀 TypeAdapter 등록
                .create();
        temp = g.toJson(rmap);
        return temp;
    }

    //곧 있을 운동 일정 1개
    @GetMapping("/getFutureWorkout")
    public String getFutureWorkout(@RequestParam Map<String, Object> pmap) {
        Map<String, Object> rmap = null;
        rmap = workoutLogic.getFutureWorkout(pmap);
        String temp = null;
        Gson g = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter()) // 커스텀 TypeAdapter 등록
                .create();
        temp = g.toJson(rmap);
        return temp;
    }

    //최근 7일간 한 운동
    @GetMapping("/getLast7Workouts")
    public String getLast7Workouts(@RequestParam Map<String, Object> pmap) {
        List<Map<String, Object>> sList = null;
        sList = workoutLogic.getLast7Workouts(pmap);
        String temp = null;
        Gson g = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter()) // 커스텀 TypeAdapter 등록
                .create();
        temp = g.toJson(sList);
        return temp;
    }

    //전체 운동 일정 조회
    @GetMapping("/getScheduleList")
    public String getScheduleList(@RequestParam Map<String, Object> pmap) {
        List<Map<String, Object>> sList = null;
        sList = workoutLogic.getScheduleList(pmap);
        String temp = null;
        Gson g = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter()) // 커스텀 TypeAdapter 등록
                .create();
        temp = g.toJson(sList);
        return temp;
    }

    //운동 일정 추가
    @PostMapping("/insertSchedule")
    public int insertSchedule(@RequestBody Map<String, Object> pmap) {
        int result = -1;
        result = workoutLogic.insertSchedule(pmap);
        return result;
    }


    //운동 일정 수정
    @PutMapping("/updateSchedule")
    public int updateSchedule(@RequestBody Map<String, Object> pmap) {
        int result = -1;
        result = workoutLogic.updateSchedule(pmap);
        return result;
    }

    //운동 완료 체크 -> 일정 업데이트
    @PutMapping("/updateIsFinished")
    public int updateIsFinished(@RequestBody Map<String, Object> pmap) {
        int result = -1;
        result = workoutLogic.updateIsFinished(pmap);
        return result;
    }

    //운동 일정 삭제
    @DeleteMapping("/deleteSchedule")
    public int deleteSchedule(@RequestParam Map<String, Object> pmap) {
        int result = -1;
        result = workoutLogic.deleteSchedule(pmap);
        return result;
    }
}
