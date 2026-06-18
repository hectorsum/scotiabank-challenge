# Gestor de Solicitudes

Challenge Scotiabank — aplicación full-stack para la gestión del ciclo de vida de solicitudes internas.

| Componente | Tecnología | Puerto |
|---|---|---|
| Frontend | Next.js 14 + TypeScript | 3000 |
| Backend | Spring Boot 3.2 + Java 21 | 8080 |

---

## Opción A — Docker (frontend + backend juntos)

Levanta ambos servicios desde la raíz con un solo comando.

### 1. Verificar que el puerto 8080 esté libre

Si ya hay un contenedor usando el 8080 (de una ejecución anterior):

```bash
docker stop $(docker ps -q --filter "publish=8080")
```

### 2. Levantar todo

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api/v1/solicitudes

### 3. Detener

```bash
docker compose down
```

> El primer build tarda varios minutos porque descarga las imágenes base de Maven y Node. Los builds siguientes son más rapidos gracias al cache de Docker.

---

## Opción B — Desarrollo local (frontend y backend por separado)

Ideal para desarrollo activo con hot reload.

### Backend

```bash
cd backend/solicitudes-backend
mvn spring-boot:run
```

Disponible en http://localhost:8080

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Disponible en http://localhost:3000

> `.env.example` apunta a `localhost:8080` por defecto. No se necesita ningún cambio para desarrollo local.

---

## Estructura del repositorio

```
scotiabank/
├── backend/
│   └── solicitudes-backend/   # API REST Spring Boot
├── frontend/                  # App Next.js 14
└── docker-compose.yml         # Orquestación full-stack
```

Cada componente tiene su propio README con documentación detallada:
- [backend/solicitudes-backend/README.md](backend/solicitudes-backend/README.md)
- [frontend/README.md](frontend/README.md)
