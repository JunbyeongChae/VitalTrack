package com.vitaltrack.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Workout {
    private int scheduleId;
    private LocalDateTime scheduleStart;
    private LocalDateTime scheduleEnd;
    private int workoutId;
    private int workoutTimeMin;
    private int kcal;
    private boolean isFinished;
    private int memNo;
}
