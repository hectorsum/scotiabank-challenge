
# 1: BUILDER — Compila el proyecto con Maven
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

# 1.1 Copiar pom.xml y descargar dependencias
COPY pom.xml .
RUN mvn dependency:resolve-plugins dependency:resolve --no-transfer-progress -q

# 1.2 Copiar código fuente y compilar sin ejecutar tests
COPY src/ ./src/
RUN mvn clean package -DskipTests --no-transfer-progress -q

# 2: RUNTIME — Imagen final ligera, solo el JAR
FROM eclipse-temurin:21-jre-alpine
LABEL maintainer="sumhector@gmail.com"
LABEL description="Gestor de Solicitudes - API REST"
LABEL version="1.0.0"

WORKDIR /app
# 2.1 Usuario no-root por seguridad
RUN addgroup -S spring && adduser -S spring -G spring

# 2.2 Copiar solo el JAR del stage anterior (sin código fuente, sin Maven)
COPY --from=builder /app/target/*.jar app.jar

RUN chown spring:spring app.jar

USER spring:spring

# Necesario porque la app puede manejar tildes
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

# Definir el % de la RAM del container para asignarle un limite y evitar que el OS se caiga
ENV JAVA_TOOL_OPTIONS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
