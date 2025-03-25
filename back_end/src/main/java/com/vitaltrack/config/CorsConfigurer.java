package com.vitaltrack.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfigurer implements WebMvcConfigurer{
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**")
        .allowedOrigins("http://localhost:8000", "http://localhost:3000", "https://vitaltrack-frontend.onrender.com")
        .allowedMethods("GET","POST","PUT","DELETE")
        .allowedHeaders("*")
        .allowCredentials(true)
        .maxAge(3600);
    }
}
