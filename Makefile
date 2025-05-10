# Makefile for OnlineExamPlatform

SHELL := /bin/bash
.DEFAULT_GOAL := all

.PHONY: all \\
        install-deps \\
        dev-backend dev-frontend \\
        test test-backend test-frontend \\
        build-services build-backend-image build-frontend-image \\
        start stop restart logs ps \\
        deploy-frontend \\
        clean clean-docker clean-build clean-node-modules

# Default target: Build Docker services and start them
all: build-services start

# Dependency Installation
install-deps:
	@echo "Installing backend dependencies..."
	@cd backend && npm install
	@echo "Installing frontend dependencies..."
	@cd frontend && npm install
	@echo "Dependencies installed."

# Development (running services locally without Docker for dev)
dev-backend:
	@echo "Starting backend development server (localhost:5000)..."
	@cd backend && npm start

dev-frontend:
	@echo "Starting frontend development server (localhost:3000)..."
	@cd frontend && npm start

# Testing
# Run backend tests
test-backend:
	@echo "Running backend tests..."
	@cd backend && npm test

# Run frontend tests (CI mode)
test-frontend:
	@echo "Running frontend tests (CI mode)..."
	@cd frontend && CI=true npm test -- --watchAll=false

# Run all tests
test: test-backend test-frontend
	@echo "All tests completed."

# Docker Compose Operations
# 'build-services' will build all services as defined in docker-compose.yml
build-services:
	@echo "Building Docker services using docker-compose..."
	@docker compose build

# 'start' will start services, building them if necessary
start:
	@echo "Starting services via docker-compose (will build if needed)..."
	@docker compose up -d --build

stop:
	@echo "Stopping services via docker-compose..."
	@docker compose down

restart:
	@echo "Restarting services via docker-compose..."
	@docker compose restart

logs:
	@echo "Showing logs for services..."
	@docker compose logs -f

ps:
	@echo "Showing status of services..."
	@docker compose ps

# Individual Docker Image Building (optional, main build is 'build-services')
build-backend-image:
	@echo "Building backend Docker image (onlineexamplatform-backend:latest)..."
	@docker build -f backend/Dockerfile -t onlineexamplatform-backend:latest backend

build-frontend-image:
	@echo "Building frontend Docker image (onlineexamplatform-frontend:latest)..."
	@docker build -f frontend/Dockerfile -t onlineexamplatform-frontend:latest frontend

# Deployment
# Deploy frontend to GitHub Pages
deploy-frontend:
	@echo "Building and deploying frontend to GitHub Pages..."
	@cd frontend && $(MAKE) deploy # Assumes frontend/Makefile has 'deploy' target

# Cleaning
clean-build:
	@echo "Removing frontend build artifacts..."
	@rm -rf frontend/build

clean-node-modules:
	@echo "Removing backend node_modules..."
	@rm -rf backend/node_modules
	@echo "Removing frontend node_modules..."
	@rm -rf frontend/node_modules

# Clean project artifacts (node_modules, frontend build) and stop Docker containers
clean: clean-build clean-node-modules stop
	@echo "Project cleaned (build artifacts, node_modules, stopped containers)."

# Clean Docker environment (stops containers, removes images built by compose)
clean-docker: stop
	@echo "Stopping services and removing Docker images built by compose..."
	@docker compose down --rmi local # Removes images for services with a 'build' context
	@echo "To remove named volumes (like mongo data), run: docker compose down -v"
