package com.vitaltrack.model;

import lombok.Data;

@Data
public class Diet {
    private Long id;
    private String memNo;   // Foreign Key from Firebase `mem_no`
    private String date;
    private Double dietKcal;
    private String dietMenu;
    private Double protein;
    private Double carbs;
    private Double fat;
}
