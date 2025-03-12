package com.vitaltrack.controller;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
public class DietController {

    @GetMapping("/food-data")
    public String getFoodData() throws IOException {
        // Load FoodData.json from the resources folder
        Resource resource = new ClassPathResource("data/FoodData20250312.json");
        return "FoodData20250312.json is accessible";
    }

    // Optimized search endpoint using Jackson Streaming API
    @GetMapping("/foods/search")
    public List<Map<String, Object>> searchFoods(@RequestParam String query) throws IOException {
        // Load FoodData.json from resources folder
        Resource resource = new ClassPathResource("data/FoodData20250312.json");
        File file = resource.getFile();

        // Create a list to store matching records
        List<Map<String, Object>> matchingRecords = new ArrayList<>();

        // Normalize query for case-insensitive search
        String normalizedQuery = query.trim().toLowerCase();

        // Use Jackson Streaming API to read and filter records
        JsonFactory jsonFactory = new JsonFactory();
        ObjectMapper objectMapper = new ObjectMapper(); // ObjectMapper for deserialization
        try (JsonParser parser = jsonFactory.createParser(file)) {
            parser.setCodec(objectMapper); // Bind the parser to the ObjectMapper

            // Traverse the JSON structure token by token
            while (!parser.isClosed()) {
                JsonToken token = parser.nextToken();

                // Look for the start of the 'records' array
                if (JsonToken.FIELD_NAME.equals(token) && "records".equals(parser.getCurrentName())) {
                    parser.nextToken(); // Move to the start of the 'records' array

                    if (JsonToken.START_ARRAY.equals(parser.currentToken())) {
                        // Traverse each record in the 'records' array
                        while (parser.nextToken() != JsonToken.END_ARRAY) {
                            if (JsonToken.START_OBJECT.equals(parser.currentToken())) {
                                // Parse individual record into a map
                                Map<String, Object> record = parser.readValueAs(Map.class); // Deserialize directly

                                // Filter records based on query
                                if (record.containsKey("식품명")) {
                                    String foodName = record.get("식품명").toString().toLowerCase();
                                    if (foodName.contains(normalizedQuery)) {
                                        matchingRecords.add(record);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return matchingRecords;
    }
}