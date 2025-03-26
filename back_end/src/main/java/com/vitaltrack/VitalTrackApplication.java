package com.vitaltrack;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan({"com.vitaltrack.dao"})
public class VitalTrackApplication {

  public static void main(String[] args) {
    SpringApplication.run(VitalTrackApplication.class, args);
  }
}