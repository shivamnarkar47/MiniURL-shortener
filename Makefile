BACKEND_DIR := MiniURL-server
FRONTEND_DIR := miniurl-frontend

.PHONY: dev backend frontend install test typecheck build clean help

.DEFAULT_GOAL := help

dev: ## Run backend + frontend together (Ctrl+C stops both)
	bunx concurrently --names "backend,frontend" --prefix-colors "blue,green" \
		"cd $(BACKEND_DIR) && bun run dev" \
		"cd $(FRONTEND_DIR) && bun run dev"

backend: ## Run only the Hono backend on :8080
	cd $(BACKEND_DIR) && bun run dev

frontend: ## Run only the Vite frontend on :5173
	cd $(FRONTEND_DIR) && bun run dev

install: ## Install deps for backend and frontend
	cd $(BACKEND_DIR) && bun install
	cd $(FRONTEND_DIR) && bun install

test: ## Run backend test suite (bun test)
	cd $(BACKEND_DIR) && bun test

typecheck: ## Typecheck the backend
	cd $(BACKEND_DIR) && bunx tsc --noEmit

build: ## Build frontend for production
	cd $(FRONTEND_DIR) && bun run build

clean: ## Remove node_modules and build output
	rm -rf $(BACKEND_DIR)/node_modules $(FRONTEND_DIR)/node_modules $(FRONTEND_DIR)/dist

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'
