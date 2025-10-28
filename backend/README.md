# Campus Life Web Platform — Backend (Maven, Spring Boot)

> Package: `ac.kr.inhatc.campus`  
> Java 17 · Spring Boot 3.3 · Maven

## Run (Local)
```bash
# 1) Configure MySQL (create DB if needed)
#    CREATE DATABASE inha_nav DEFAULT CHARACTER SET utf8mb4;

# 2) Start Spring Boot
mvn spring-boot:run
# or
mvn clean package && java -jar target/campus-backend-0.0.1-SNAPSHOT.jar
```

Swagger UI: http://localhost:8080/swagger-ui/index.html

## API
- `GET /api/buildings` — list
- `GET /api/buildings/{id}` — get by id
- `POST /api/buildings` — create

Request example:
```bash
curl -X POST http://localhost:8080/api/buildings   -H "Content-Type: application/json"   -d '{ "code":"7-315", "name":"7호관 315호", "description":"강의실", "lat":37.448, "lng":126.653 }'
```

## Frontend (React) Dev Proxy
Vite `proxy` `/api` → `http://localhost:8080`
