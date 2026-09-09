FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN ./mvnw -q -DskipTests dependency:go-offline
COPY src src
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN addgroup --system kudipal && adduser --system --ingroup kudipal kudipal
COPY --from=build /workspace/target/*.jar /app/kudipal-backend.jar
USER kudipal
EXPOSE 8081
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "/app/kudipal-backend.jar"]
