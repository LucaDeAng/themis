# Development Commands
.PHONY: help install dev build test lint format clean db-up db-down migrate seed

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	pnpm install

dev: ## Start development servers (web + api)
	pnpm run dev

build: ## Build all packages and apps
	pnpm run build

test: ## Run tests
	pnpm run test

lint: ## Run linting
	pnpm run lint

format: ## Format code
	pnpm run format

typecheck: ## Run type checking
	pnpm run typecheck

clean: ## Clean build artifacts
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf packages/*/node_modules
	rm -rf apps/*/.next
	rm -rf apps/*/dist
	rm -rf packages/*/dist

db-up: ## Start PostgreSQL database
	docker compose -f infra/docker-compose.yml up -d db
	@echo "Waiting for database to be ready..."
	@sleep 5

db-down: ## Stop PostgreSQL database
	docker compose -f infra/docker-compose.yml down

db-logs: ## View database logs
	docker compose -f infra/docker-compose.yml logs -f db

migrate: ## Run database migrations
	pnpm run prisma:migrate

generate: ## Generate Prisma client
	pnpm run prisma:generate

studio: ## Open Prisma Studio
	pnpm run prisma:studio

seed: ## Seed database with sample data
	pnpm run seed

reset: ## Reset database (WARNING: destructive)
	@echo "This will delete all data. Press Ctrl+C to cancel, or Enter to continue..."
	@read line
	docker compose -f infra/docker-compose.yml down -v
	$(MAKE) db-up
	$(MAKE) migrate
	$(MAKE) seed

setup: ## Complete setup (install, db, migrate, seed)
	$(MAKE) install
	$(MAKE) db-up
	$(MAKE) generate
	$(MAKE) migrate
	$(MAKE) seed
	@echo ""
	@echo "✅ Setup complete! Run 'make dev' to start development."
