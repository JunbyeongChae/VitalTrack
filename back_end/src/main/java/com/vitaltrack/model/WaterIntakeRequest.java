package com.vitaltrack.model;

import lombok.Data;

@Data
public class WaterIntakeRequest {
    private int memNo;
    private String dietDate;
    private int waterIntake;
}
