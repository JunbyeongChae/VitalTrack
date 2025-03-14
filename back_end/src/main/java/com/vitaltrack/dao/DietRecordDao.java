package com.vitaltrack.dao;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DietRecordDao {
    // Getters and Setters
    private int memNo; // Member ID
    private String dietDate; // Must be in 'YYYY-MM-DD' format
    private String mealType; // Meal type (e.g., "아침")
    private String name; // Food name
    private int calories; // Calories
    private String memo; // Optional memo
}