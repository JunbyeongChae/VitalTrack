FROM gradle:8.5-jdk17 AS builder
WORKDIR /app
COPY ../ . 
WORKDIR /app/back_end 
RUN gradle clean build -x test

FROM openjdk:17
WORKDIR /app
COPY --from=builder /app/back_end/build/libs/*.jar app.jar
EXPOSE 8000
ENTRYPOINT ["java", "-jar", "app.jar"]
