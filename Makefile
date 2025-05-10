# Makefile for local CI/testing/build/docker tasks

.PHONY: test-backend test-frontend test build-backend build-frontend build up down

# Run backend tests
test-backend:
	@echo "Running backend tests..."
	@cd backend && npm test

# Run frontend tests (CI mode)
test-frontend:
	@echo "Running frontend tests..."
	@cd frontend && CI=true npm test -- --watchAll=false

# Run all tests
test: test-backend test-frontend
	@echo "All tests passed."

# Build Docker image for backend
build-backend:
	@echo "Building backend Docker image..."
	docker build -f backend/Dockerfile -t onlineexamplatform-backend:latest backend

# Build Docker image for frontend
build-frontend:
	@echo "Building frontend Docker image..."
	docker build -f frontend/Dockerfile -t onlineexamplatform-frontend:latest frontend

# Build all Docker images
build: build-backend build-frontend
	@echo "Docker images built."

# Start containers (runs tests and build first)
up: test build
	@echo "Starting services via docker-compose (rebuild images and recreate containers)..."
	docker compose up -d --build --force-recreate

# Stop and remove containers and networks
down:
	@echo "Stopping services..."
	docker compose down

# Full clean (remove images as well)
clean: down
	@echo "Removing Docker images..."
	docker rmi onlineexamplatform-backend:latest onlineexamplatform-frontend:latest || true
