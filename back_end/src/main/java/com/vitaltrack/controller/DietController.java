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

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import java.util.HashMap;

@RestController
@RequestMapping("/api")
public class DietController {
  @PostConstruct
  public void checkFoodDataFile() {
    try {
      Resource resource = new ClassPathResource("data/FoodData20250312.json");
      System.out.println("[🧪 확인] FoodData20250312.json 존재 여부: " + resource.exists());
      if (resource.exists()) {
        System.out.println("[✅ 성공] 파일 이름: " + resource.getFilename());
      } else {
        System.out.println("[❌ 실패] ClassPath 상에 파일이 없습니다.");
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  @PostConstruct
  public void debugJsonLoad() {
    try {
      Resource resource = new ClassPathResource("data/FoodData20250312.json");
      if (resource.exists()) {
        InputStream is = resource.getInputStream();
        String content = new BufferedReader(new InputStreamReader(is))
            .lines().collect(Collectors.joining("\n"));
        System.out.println("[✅ 파일 내용 일부 출력]");
        System.out.println(content.substring(0, Math.min(300, content.length())) + "...");
      } else {
        System.out.println("[❌ ClassPathResource로 파일을 찾을 수 없음]");
      }
    } catch (Exception e) {
      System.out.println("[❌ 파일 로드 중 에러]");
      e.printStackTrace();
    }
  }

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

    return matchingRecords;
  }
}