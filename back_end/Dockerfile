FROM openjdk:21
WORKDIR /app
COPY build/libs/*.jar app.jar
EXPOSE 8000
ENTRYPOINT ["java", "-jar", "app.jar"]
