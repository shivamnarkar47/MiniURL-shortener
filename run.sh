#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/MiniURL-server"
FRONTEND_DIR="$SCRIPT_DIR/miniurl-frontend"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[MiniURL]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[Warning]${NC} $1"
}

info() {
    echo -e "${BLUE}[Info]${NC} $1"
}

header() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}  $1${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

check_prerequisites() {
    log "Checking prerequisites..."

    if ! command -v bun &> /dev/null; then
        warn "Bun not found. Backend and frontend will not be available."
        BACKEND_AVAILABLE=false
        FRONTEND_AVAILABLE=false
        error "Bun is not installed. Please install it first."
        exit 1
    else
        BACKEND_AVAILABLE=true
        FRONTEND_AVAILABLE=true
        log "Bun found: $(bun --version)"
    fi
}

start_backend() {
    if [ "$BACKEND_AVAILABLE" = false ]; then
        warn "Backend not started (Go not available)"
        return
    fi

    header "Starting Backend (Bun + Hono)"

    if [ ! -f "$BACKEND_DIR/package.json" ]; then
        warn "Backend directory not found or missing package.json"
        return
    fi

    cd "$BACKEND_DIR"

    if [ ! -d "node_modules" ]; then
        warn "Backend dependencies not installed, installing..."
        bun install
    fi

    log "Starting backend server on http://localhost:8080"
    PORT=8080 bun run src/index.ts &
    BACKEND_PID=$!
    echo $BACKEND_PID > /tmp/miniurl-backend.pid
    log "Backend started with PID: $BACKEND_PID"
}

start_frontend() {
    if [ "$FRONTEND_AVAILABLE" = false ]; then
        warn "Frontend not started (Bun not available)"
        return
    fi

    header "Starting Frontend (Vite)"

    if [ ! -f "$FRONTEND_DIR/package.json" ]; then
        warn "Frontend directory not found or missing package.json"
        return
    fi

    cd "$FRONTEND_DIR"

    log "Starting frontend development server on http://localhost:5173"
    bun run dev &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > /tmp/miniurl-frontend.pid
    log "Frontend started with PID: $FRONTEND_PID"
}

stop_services() {
    header "Stopping Services"

    if [ -f /tmp/miniurl-backend.pid ]; then
        BACKEND_PID=$(cat /tmp/miniurl-backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID 2>/dev/null || true
            log "Stopped backend (PID: $BACKEND_PID)"
        fi
        rm /tmp/miniurl-backend.pid
    fi

    if [ -f /tmp/miniurl-frontend.pid ]; then
        FRONTEND_PID=$(cat /tmp/miniurl-frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill $FRONTEND_PID 2>/dev/null || true
            log "Stopped frontend (PID: $FRONTEND_PID)"
        fi
        rm /tmp/miniurl-frontend.pid
    fi

    pkill -f "MiniURL-server/src/index.ts" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true

    log "All services stopped"
}

status() {
    header "Service Status"

    local running=false

    if [ -f /tmp/miniurl-backend.pid ]; then
        PID=$(cat /tmp/miniurl-backend.pid)
        if kill -0 $PID 2>/dev/null; then
            echo -e "  ${GREEN}●${NC} Backend  - Running (PID: $PID)"
            running=true
        else
            echo -e "  ${RED}●${NC} Backend  - Stale PID file"
        fi
    else
            if pgrep -f "MiniURL-server/src/index.ts" > /dev/null; then
            echo -e "  ${GREEN}●${NC} Backend  - Running"
            running=true
        else
            echo -e "  ${YELLOW}●${NC} Backend  - Stopped"
        fi
    fi

    if [ -f /tmp/miniurl-frontend.pid ]; then
        PID=$(cat /tmp/miniurl-frontend.pid)
        if kill -0 $PID 2>/dev/null; then
            echo -e "  ${GREEN}●${NC} Frontend - Running (PID: $PID)"
            running=true
        else
            echo -e "  ${RED}●${NC} Frontend - Stale PID file"
        fi
    else
        if pgrep -f "vite" > /dev/null; then
            echo -e "  ${GREEN}●${NC} Frontend - Running"
            running=true
        else
            echo -e "  ${YELLOW}●${NC} Frontend - Stopped"
        fi
    fi

    if [ "$running" = true ]; then
        echo ""
        info "Backend:  http://localhost:8080"
        info "Frontend: http://localhost:5173"
    fi
}

usage() {
    echo ""
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  start       Start both backend and frontend"
    echo "  stop        Stop all running services"
    echo "  restart     Restart all services"
    echo "  status      Show status of all services"
    echo "  backend     Start only the backend"
    echo "  frontend    Start only the frontend"
    echo "  dev         Start both in development mode"
    echo "  build       Build frontend for production"
    echo "  install     Install all dependencies"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start    # Start both services"
    echo "  $0 dev      # Start development servers"
    echo "  $0 status   # Check service status"
    echo ""
}

install_dependencies() {
    header "Installing Dependencies"

    if [ "$BACKEND_AVAILABLE" = true ]; then
        log "Installing backend dependencies..."
        cd "$BACKEND_DIR"
        bun install
    fi

    if [ "$FRONTEND_AVAILABLE" = true ]; then
        log "Installing Bun dependencies..."
        cd "$FRONTEND_DIR"
        bun install
    fi

    log "Dependencies installed"
}

build_frontend() {
    if [ "$FRONTEND_AVAILABLE" = false ]; then
        warn "Cannot build frontend (Bun not available)"
        return
    fi

    header "Building Frontend"

    cd "$FRONTEND_DIR"
    log "Building production bundle..."
    bun run build

    log "Frontend built successfully!"
    info "Output: $FRONTEND_DIR/dist"
}

main() {
    case "${1:-help}" in
        start)
            check_prerequisites
            stop_services 2>/dev/null || true
            start_backend
            start_frontend
            sleep 2
            status
            ;;
        stop)
            stop_services
            ;;
        restart)
            stop_services
            sleep 1
            check_prerequisites
            start_backend
            start_frontend
            sleep 2
            status
            ;;
        status)
            status
            ;;
        backend)
            check_prerequisites
            start_backend
            ;;
        frontend)
            check_prerequisites
            start_frontend
            ;;
        dev)
            check_prerequisites
            start_backend
            start_frontend
            sleep 2
            status
            info "Press Ctrl+C to stop all services"
            wait
            ;;
        build)
            check_prerequisites
            build_frontend
            ;;
        install)
            check_prerequisites
            install_dependencies
            ;;
        help|--help|-h)
            usage
            ;;
        *)
            error "Unknown command: $1"
            usage
            exit 1
            ;;
    esac
}

trap 'stop_services 2>/dev/null' EXIT INT TERM

main "$@"
