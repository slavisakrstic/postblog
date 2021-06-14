# Frontend

Frontend application for post blog

## Prerequisites
- node v12.9.1
- npm v6.10.2
- docker

## Build locally
1. Install dependencies: `npm install`
2. Build: `npm run build`

## Run locally
1. Run in development: `npm run start`

## Run tests
1. Run unit tests: `npm run test`
2. Run unit tests with code coverage: `npm run test:coverage`

### Configuration
- See `.env`

## Launch locally with docker compose
- See docker-compose.yml 
- See Dockerfile

## Prerequisites to run in docker
- docker
- Use `.env` for local development configuration.

The docker compose configuration (in `docker-compose.yml`) will run the following components
- Frontned Application

## Run in docker
- `docker network create tx` - if it is not created
- `docker network create pgadmin` - if it is not created
- `docker-compose up -d` - Frontend application

## URLs
- Applicaction is running on http://localhost:3020