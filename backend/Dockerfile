FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080

HEALTHCHECK CMD wget --spider --quiet http://localhost:8080/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
