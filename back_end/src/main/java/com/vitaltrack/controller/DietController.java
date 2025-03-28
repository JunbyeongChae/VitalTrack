/* 식단 검색기능 */
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
    public List<Map<String, Object>> searchFoods(@RequestParam(name = "query") String query) throws IOException {
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
                if (JsonToken.FIELD_NAME.equals(token) && "records".equals(parser.currentName())) {
                    parser.nextToken(); // Move to the start of the 'records' array

                    if (JsonToken.START_ARRAY.equals(parser.currentToken())) {
                        // Traverse each record in the 'records' array
                        while (parser.nextToken() != JsonToken.END_ARRAY) {
                            if (JsonToken.START_OBJECT.equals(parser.currentToken())) {
                                // Parse individual record into a map
                                Map record = parser.readValueAs(Map.class); // Deserialize directly

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

        // Sort matching records by relevance to query
        matchingRecords.sort((record1, record2) -> {
            String foodName1 = record1.get("식품명").toString().toLowerCase();
            String foodName2 = record2.get("식품명").toString().toLowerCase();

            // 1. Exact match gets highest priority
            if (foodName1.equals(normalizedQuery) && !foodName2.equals(normalizedQuery)) {
                return -1;
            }
            if (!foodName1.equals(normalizedQuery) && foodName2.equals(normalizedQuery)) {
                return 1;
            }

            // 2. Starts with query gets second priority
            if (foodName1.startsWith(normalizedQuery) && !foodName2.startsWith(normalizedQuery)) {
                return -1;
            }
            if (!foodName1.startsWith(normalizedQuery) && foodName2.startsWith(normalizedQuery)) {
                return 1;
            }

            // 3. Compare by index of query in the food name (earlier is better)
            int index1 = foodName1.indexOf(normalizedQuery);
            int index2 = foodName2.indexOf(normalizedQuery);
            if (index1 != index2) {
                return Integer.compare(index1, index2);
            }

            // 4. If all else is equal, sort alphabetically
            return foodName1.compareTo(foodName2);
        });
        return matchingRecords;
    }
}