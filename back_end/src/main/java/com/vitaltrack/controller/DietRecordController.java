package com.vitaltrack.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    } //end of PostMapping

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
    }//end of GetMapping(memNo)

    @GetMapping("/macronutrients/{memNo}")
    public ResponseEntity<?> getMacronutrientsByMemberNumber(@PathVariable int memNo,
                                                             @RequestParam(required = false) String date) {
        try {
            // Get the date parameter or default to today
            LocalDate targetDate = date != null ? LocalDate.parse(date) : LocalDate.now();

            // Get all meals for the member on the specified date
            List<DietRecordDao> meals = dietRecordService.getMealsByMemberAndDate(memNo, targetDate);

            // Calculate consumed macronutrients
            double totalProtein = 0.0;
            double totalCarbs = 0.0;
            double totalFat = 0.0;

            for (DietRecordDao meal : meals) {
                if (meal.getProtein() != null) totalProtein += meal.getProtein();
                if (meal.getCarbs() != null) totalCarbs += meal.getCarbs();
                if (meal.getFat() != null) totalFat += meal.getFat();
            }

            // You would need to retrieve target values from user settings or calculate them
            // For example, based on the user's daily calorie target

            // Create response object
            Map<String, Object> response = new HashMap<>();
            Map<String, Double> consumed = new HashMap<>();
            Map<String, Double> target = new HashMap<>();

            consumed.put("protein", totalProtein);
            consumed.put("carbs", totalCarbs);
            consumed.put("fat", totalFat);

            // Sample targets - replace with actual user targets
            target.put("protein", 90.0);  // These should come from user settings
            target.put("carbs", 150.0);
            target.put("fat", 40.0);

            response.put("consumed", consumed);
            response.put("target", target);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch macronutrient data: " + e.getMessage());
        }
    }

    @DeleteMapping("/{recordId}")
    public ResponseEntity<?> deleteMeal(@PathVariable int recordId) {
        try {
            // Check if the meal exists
            boolean exists = dietRecordService.checkIfMealExists(recordId);
            if (!exists) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Meal not found with ID: " + recordId);
            }

            // Delete the meal
            boolean deleted = dietRecordService.deleteMeal(recordId);

            if (deleted) {
                return ResponseEntity.ok("Meal deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to delete meal");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting meal: " + e.getMessage());
        }
    } //end of DeleteMapping
}
