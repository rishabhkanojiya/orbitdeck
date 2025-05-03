# ----------- BUILD STAGE -------------
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests

# ----------- RUNTIME STAGE -------------
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=build /app/target/orbitdeck-analytics-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 9069

ENTRYPOINT ["java", "-jar", "app.jar"]
