package com.vitaltrack.dao;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DietRecordDao {
    // Getters and Setters
    private int recordId; // Primary key from diet_record table
    private int memNo; // Member ID
    private String dietDate; // Must be in 'YYYY-MM-DD' format
    private String mealType; // Meal type (e.g., "Breakfast")
    private String name; // Food name
    private int calories; // Calories
    private String memo; // Optional memo
    private Double protein;
    private Double carbs;
    private Double fat;
    private Integer waterIntake;
}