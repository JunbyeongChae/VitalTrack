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

    public List<Map<String, Object>> scheduleList() {
        List<Map<String, Object>> sList = null;
        sList = workoutDao.scheduleList();
        return sList;
    }
}
