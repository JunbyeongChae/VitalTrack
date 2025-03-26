# 1단계: Build stage
FROM gradle:7.4.2-jdk17 AS builder
WORKDIR /build

# 캐시 활용을 위해 의존성 관련 파일만 먼저 복사
COPY ../build.gradle .
COPY ../settings.gradle .
COPY ../gradle/ ./gradle/
COPY gradle.properties* .

# 의존성 캐시
RUN gradle dependencies || true

# 그 다음 전체 소스 복사
COPY . .

# 테스트는 제외하고 빌드
RUN gradle build -x test --no-daemon

# 2단계: Runtime stage
FROM openjdk:17
WORKDIR /app
COPY --from=builder /build/build/libs/*.jar app.jar
EXPOSE 8000
ENTRYPOINT ["java", "-jar", "app.jar"]
