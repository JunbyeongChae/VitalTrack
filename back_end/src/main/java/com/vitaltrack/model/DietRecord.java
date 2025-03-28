package com.vitaltrack.model;

import lombok.Data;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
public class DietRecord {
    private int recordId;              // Primary Key
    private int memNo;                 // Foreign Key to memberinfo table
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dietDate;        // Date of the meal
    private MealType mealType;         // Enum for meal type (아침, 점심, 저녁, 간식)
    private String name;             // Name of the food
    private int calories;              // Calories consumed
    private String memo;               // Optional memo
    private Double protein;
    private Double carbs;
    private Double fat;

    // Timestamps (managed automatically by the database)
    private String createdAt;          // Creation timestamp
    private String updatedAt;          // Last updated timestamp

    // Enum for MealType
    public enum MealType {
        Breakfast, Lunch, Dinner, Snack
    }
}