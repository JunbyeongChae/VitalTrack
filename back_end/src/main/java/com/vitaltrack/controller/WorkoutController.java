package com.vitaltrack.controller;

import com.google.gson.Gson;
import com.vitaltrack.logic.WorkoutLogic;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@Log4j2
@RestController
@RequestMapping("/workout")
public class WorkoutController {
    @Autowired
    private WorkoutLogic workoutLogic;

    @GetMapping("/scheduleList")
    public String scheduleList() {
        log.info("scheduleList 호출 성공.");
        List<Map<String, Object>> sList = null;
        sList = workoutLogic.scheduleList();
        String temp = null;
        Gson g = new Gson();
        temp = g.toJson(sList);
        return temp;
    }

}
