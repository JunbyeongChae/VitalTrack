package com.vitaltrack.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class DietController {
    @GetMapping("/food-data")
    public String getFoodData() throws IOException {
        // Load FoodData.json from the resources folder
        Resource resource = new ClassPathResource("data/FoodData.json");

        // Read file content into a string and return it as a response
        return Files.readString(resource.getFile().toPath());
    }
    // Search endpoint that matches `식품명` with the query parameter
    @GetMapping("/foods/search")
    public List<Map<String, Object>> searchFoods(@RequestParam String query) throws IOException {
        // Load the FoodData.json file
        Resource resource = new ClassPathResource("data/FoodData.json");
        String jsonData = Files.readString(resource.getFile().toPath());

        // Parse the JSON data using Jackson into a Map
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> foodData = objectMapper.readValue(jsonData, new TypeReference<>() {});

        // Extract the 'records' array from the JSON
        List<Map<String, Object>> records = (List<Map<String, Object>>) foodData.get("records");

        // Normalize query for case-insensitive search
        String normalizedQuery = query.trim().toLowerCase();

        // Filter the records to include only those where `식품명` contains the query string
        return records.stream()
                .filter(record -> record.get("식품명") != null &&
                        record.get("식품명").toString().toLowerCase().contains(normalizedQuery))
                .collect(Collectors.toList());

    }
}