#D:\VitalTrack-JunbyeongChae\back_end\Dockerfile
# 1단계: Build stage
FROM gradle:7.4.2-jdk17 AS builder
WORKDIR /build

COPY back_end/build.gradle .
COPY back_end/settings.gradle .
COPY back_end/gradle/ ./gradle/
COPY back_end/src/ ./src/
COPY back_end/gradlew .
COPY back_end/gradle.properties* .

RUN chmod +x gradlew

# 테스트는 제외하고 빌드
RUN ./gradlew build -x test --no-daemon

# 2단계: Runtime stage
FROM openjdk:17
WORKDIR /app
COPY --from=builder /build/build/libs/*.jar app.jar
EXPOSE 8000
ENTRYPOINT ["java", "-jar", "app.jar"]
