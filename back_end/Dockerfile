# 1단계: Gradle 빌드 단계
FROM gradle:7.6.0-jdk21 AS builder
WORKDIR /app
COPY . .
RUN gradle clean build -x test

# 2단계: 실행 단계
FROM openjdk:21
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8000
ENTRYPOINT ["java", "-jar", "app.jar"]
