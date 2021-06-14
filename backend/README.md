# Backend

Backend application for post blog

## Prerequisites
- node v12.9.1
- npm v6.10.2
- docker

## Build locally
1. Install dependencies: `npm install`
2. Build: `npm run build`

## Run locally
1. Run in development: `npm run start:dev`
2. Run in development with debugger `npm run start:debug`
3. Run `npm run start`

## Run tests
1. Run unit tests: `npm run test`
2. Run integration tests: `npm run test:integration`

## Run integration tests NOTE:
- First execute: `docker-componse up -d` to download pg image. 
- Tests will timeout if image is not downloaded

### Configuration
- See `.env`

## Launch locally with docker compose
- See docker-componse.yml 
- See Dockerfile

## Prerequisites to run in docker
- docker
- Use `.env` for local development configuration.

The docker compose configuration (in `docker-compose.yml`) will run the following components
- PostgreSQL
- PostgreSQL Admin
- Backend Application

## Run in docker
- `docker-componse up -d` - will start PG, PG Admin and the backend application

## URLs
- Applicaction is running on http://localhost:3010
- Swagger URL: http://localhost:3010/api