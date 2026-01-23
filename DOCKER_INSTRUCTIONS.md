# Docker Setup Instructions

## Prerequisites
- Docker and Docker Compose installed.

## Services
The setup includes the following services:
- **frontend**: Next.js application (Port 3000)
- **backend**: NestJS application (Port 3001)
- **postgres**: Database (Port 5432)
- **redis**: Cache (Port 6379)

## How to Run

1.  **Build and Start**:
    ```bash
    docker compose up --build -d
    ```

2.  **Verify**:
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend: [http://localhost:3001](http://localhost:3001)

3.  **Logs**:
    - Backend Logs: `docker compose logs -f backend`
    - Frontend Logs: `docker compose logs -f frontend`

4.  **Database Migration**:
    The backend Dockerfile generates the client, but you may need to run migrations if the DB is empty.
    ```bash
    docker compose exec backend npx prisma migrate deploy
    ```
    *Note: Ensure the backend is running before executing this.*

5.  **Stop**:
    ```bash
    docker compose down
    ```

## Troubleshooting

### Backend: "Cannot find module '/app/dist/main'"
If you encounter this error, it means the build output structure was mismatched.
1.  Ensure `backend-ecommerce/tsconfig.json` has `"rootDir": "./src"`.
2.  Run `docker compose up --build --force-recreate` to verify.

### Database Connection
Ensure the backend logs show "Connected to Database". If it fails, the container usually restarts until Postgres is ready.
