/* 사용자 식단 CRUD */

package com.vitaltrack.controller;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.vitaltrack.model.WaterIntakeRequest;
import com.vitaltrack.logic.DietRecordLogic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vitaltrack.dao.DietRecordDao;

@RestController
@RequestMapping("/api/meals")
public class DietRecordController {
  private final DietRecordLogic dietRecordLogic;

  @Autowired
  public DietRecordController(DietRecordLogic dietRecordLogic) {
    this.dietRecordLogic = dietRecordLogic;
  }

  @PostMapping
  public ResponseEntity<DietRecordDao> saveMeal(@RequestBody DietRecordDao dietRecord) {
    try {
      DietRecordDao savedRecord = dietRecordLogic.saveDietRecord(dietRecord);
      return ResponseEntity.status(201).body(savedRecord); // 201 Created
    } catch (Exception e) {
      System.err.println("Error saving meal: " + e.getMessage());
      return ResponseEntity.internalServerError().build(); // 500 Internal Server Error
    }
  } // end of PostMapping

  @PostMapping("/water-intake")
  public ResponseEntity<?> updateWaterIntake(@RequestBody WaterIntakeRequest request) {
    try {
      // Extract data from request
      int memNo = request.getMemNo();
      String dietDate = request.getDietDate();
      int waterIntake = request.getWaterIntake();

      // Call the service method
      dietRecordLogic.updateWaterIntake(memNo, dietDate, waterIntake);

      // Return success response
      Map<String, Object> response = new HashMap<>();
      response.put("status", "success");
      response.put("message", "Water intake updated successfully");

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      // Handle errors
      Map<String, Object> errorResponse = new HashMap<>();
      errorResponse.put("status", "error");
      errorResponse.put("message", "Failed to update water intake: " + e.getMessage());

      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
  }

  // GET: /api/meals/{memNo}
  @GetMapping("/{memNo}")
  public ResponseEntity<?> getMealsByMemberNumber(
      @PathVariable("memNo") int memNo,
      @RequestParam(name = "date", required = false) String date) {

    try {
      List<DietRecordDao> meals;

      if (date != null && !date.isEmpty()) {
        // Parse the date string from the request parameter
        LocalDate parsedDate = LocalDate.parse(date).atStartOfDay(ZoneId.of("Asia/Seoul")).toLocalDate();
        meals = dietRecordLogic.getMealsByMemberAndDate(memNo, parsedDate);
      } else {
        // Fallback to current date if no date provided
        meals = dietRecordLogic.getMealsByMemberAndDate(memNo, LocalDate.now());
      }

      return ResponseEntity.ok(meals);
    } catch (Exception e) {
      e.printStackTrace();
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("error", "Failed to retrieve meals: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
  }

  // Add this endpoint for fetching meals by member number and date
  @GetMapping("/meals/{memNo}")
  public List<DietRecordDao> getMealsByMemberAndDate(
      @PathVariable("memNo") int memNo,
      @RequestParam(name = "date", required = false) String date) {

    LocalDate parsedDate = (date != null) ? LocalDate.parse(date).atStartOfDay(ZoneId.of("Asia/Seoul")).toLocalDate()
        : LocalDate.now();

    return dietRecordLogic.getMealsByMemberAndDate(memNo, parsedDate);
  }

  // Also add an endpoint for the macronutrients
  @GetMapping("/meals/{memNo}/macronutrients")
  public Map<String, Object> getMacronutrientsByMemberAndDate(
      @PathVariable("memNo") int memNo,
      @RequestParam(name = "date", required = false) String date) {

    LocalDate parsedDate = (date != null) ? LocalDate.parse(date).atStartOfDay(ZoneId.of("Asia/Seoul")).toLocalDate()
        : LocalDate.now();

    return dietRecordLogic.getMacronutrientsByMemberAndDate(memNo, parsedDate);
  }

  @GetMapping("/macronutrients/{memNo}")
  public ResponseEntity<?> getMacronutrientsByMemberNumber(
      @PathVariable("memNo") int memNo,
      @RequestParam(name = "date", required = false) String date) {
    try {
      // Get the date parameter or default to today
      LocalDate targetDate = date != null ? LocalDate.parse(date).atStartOfDay(ZoneId.of("Asia/Seoul")).toLocalDate()
          : LocalDate.now();

      // Get all meals for the member on the specified date
      List<DietRecordDao> meals = dietRecordLogic.getMealsByMemberAndDate(memNo, targetDate);

      // Calculate consumed macronutrients
      double totalProtein = 0.0;
      double totalCarbs = 0.0;
      double totalFat = 0.0;

      for (DietRecordDao meal : meals) {
        if (meal.getProtein() != null)
          totalProtein += meal.getProtein();
        if (meal.getCarbs() != null)
          totalCarbs += meal.getCarbs();
        if (meal.getFat() != null)
          totalFat += meal.getFat();
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
      target.put("protein", 90.0); // These should come from user settings
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
      boolean exists = dietRecordLogic.checkIfMealExists(recordId);
      if (!exists) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body("Meal not found with ID: " + recordId);
      }

      // Delete the meal
      boolean deleted = dietRecordLogic.deleteMeal(recordId);

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
  } // end of DeleteMapping
}
