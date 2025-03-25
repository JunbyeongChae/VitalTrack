package com.vitaltrack;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
@SpringBootApplication
@ComponentScan(basePackages = {"com.vitaltrack"})
@MapperScan({"com.vitaltrack.dao", "com.vitaltrack.mapper"})
public class VitalTrackApplication {

  public static void main(String[] args) {
    SpringApplication.run(VitalTrackApplication.class, args);
  }
}