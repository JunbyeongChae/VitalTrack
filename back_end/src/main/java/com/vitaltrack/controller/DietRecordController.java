package com.vitaltrack.controller;

import java.util.List;

import com.vitaltrack.service.DietRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vitaltrack.dao.DietRecordDao;
import com.vitaltrack.service.DietRecordService;

@RestController
@RequestMapping("/api/meals")
public class DietRecordController {
    private final DietRecordService dietRecordService;

    @Autowired
    public DietRecordController(DietRecordService dietRecordService) {
        this.dietRecordService = dietRecordService;
    }

    @PostMapping
    public ResponseEntity<DietRecordDao> saveMeal(@RequestBody DietRecordDao dietRecord) {
        try {
            DietRecordDao savedRecord = dietRecordService.saveDietRecord(dietRecord);
            return ResponseEntity.status(201).body(savedRecord); // 201 Created
        } catch (Exception e) {
            System.err.println("Error saving meal: " + e.getMessage());
            return ResponseEntity.internalServerError().build(); // 500 Internal Server Error
        }
    }



    // GET: /api/meals/{memNo}
    @GetMapping("/{memNo}")
    public ResponseEntity<?> getMealsByMemberNumber(@PathVariable int memNo) {
        try {
            // Delegate to the service layer
            List<DietRecordDao> meals = dietRecordService.getMealsByMemberNumber(memNo);

            // Return 404 if no meals are found
            if (meals == null || meals.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No meals found for member number: " + memNo);
            }

            return ResponseEntity.ok(meals);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch meals: " + e.getMessage());
        }
    }
}
