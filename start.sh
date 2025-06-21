#!/bin/bash

BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
DOCKER_COMPOSE_FILE="docker-compose.only-db-redis.yml"
FRONTEND_PORT=3000
BACKEND_PORT=3001
BACKEND_LOG_FILE="backend.log"
FRONTEND_LOG_FILE="frontend.log"

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

cleanup() {
    echo -e "\n${RED}--- Ctrl+C detected. Initiating graceful shutdown... ---${NC}"
    stop_all_services
    exit 0
}

trap cleanup SIGINT

kill_by_port() {
    local port=$1
    local service_name=$2
    local max_attempts=5
    local attempt=0
    local pids_to_kill=""

    echo -e "${BLUE}Attempting to stop ${service_name} on port ${port}...${NC}"

    while [ ${attempt} -lt ${max_attempts} ]; do
        pids_to_kill=$(lsof -t -i :${port} 2>/dev/null)

        if [ -z "$pids_to_kill" ]; then
            echo -e "${GREEN}  ${service_name} on port ${port} successfully stopped.${NC}"
            return 0
        fi

        if [ ${attempt} -eq 0 ]; then
            echo -e "${BLUE}  Found process on port ${port}: ${pids_to_kill}. Sending SIGTERM (graceful)...${NC}"
            kill ${pids_to_kill} 2>/dev/null
        elif [ ${attempt} -eq $((max_attempts / 2)) ]; then
            echo -e "${RED}  ${service_name} not stopping gracefully. Sending SIGKILL (forceful)...${NC}"
            kill -9 ${pids_to_kill} 2>/dev/null
        fi

        sleep 1
        attempt=$((attempt + 1))
    done

    echo -e "${RED}  Warning: ${service_name} on port ${port} might still be running. You may need to kill it manually.${NC}"
    return 1
}

stop_all_services() {
    echo -e "Stopping all services..."

    kill_by_port $FRONTEND_PORT "frontend app"

    kill_by_port $BACKEND_PORT "backend app"

    echo -e "${BLUE}Stopping Docker services...${NC}"

    cd "../$BACKEND_DIR" && docker-compose -f "$DOCKER_COMPOSE_FILE" down
    if [ $? -ne 0 ]; then
        echo -e "${RED}Warning: Docker Compose 'down' command failed. You might need to stop containers manually.${NC}"
    else
        echo -e "${GREEN}Docker Compose services stopped.${NC}"
    fi

    echo -e "${GREEN}--- All services stopped. ---${NC}"
}

echo -e "${GREEN}--- Starting Development Environment ---${NC}"

echo -e "1. Navigating to backend directory: ${BACKEND_DIR}${NC}"
cd "$BACKEND_DIR"

echo ""

# --- Step 1: Start Docker Services (MySQL & Redis) ---
echo -e "2. Starting Docker Compose services (MySQL & Redis) in detached mode.${NC}"
cp .env.copy .env
docker-compose -f "$DOCKER_COMPOSE_FILE" up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Docker Compose failed to start backend services. Please check your '$DOCKER_COMPOSE_FILE'. Exiting.${NC}"
    exit 1
fi
echo -e "${GREEN}   Docker Compose services started.${NC}"

echo ""

# --- Step 2: Start Backend App ---
echo -e "3. Starting backend app...${NC}"

npm install > "$BACKEND_LOG_FILE" 2>&1 &

npm run db:generate > "$BACKEND_LOG_FILE" 2>&1 &

npm run db:push > "$BACKEND_LOG_FILE" 2>&1 &

nohup yarn dev > "$BACKEND_LOG_FILE" 2>&1 &
echo -e "${GREEN}   Backend app started in background.${NC}"

echo ""

echo -e "4. Navigating to frontend directory: ${FRONTEND_DIR}${NC}"
cd "../$FRONTEND_DIR" || { echo -e "${RED}Error: Frontend directory '$FRONTEND_DIR' not found.${NC}"; exit 1; }

echo ""

echo -e "5. Starting frontend app...${NC}"

npm install > "$FRONTEND_LOG_FILE" 2>&1 &

nohup npm start > "$FRONTEND_LOG_FILE" 2>&1 &
echo -e "${GREEN}   Frontend app started in background.${NC}"

echo -e "${GREEN}--- All services are running in the background. ---${NC}"
echo -e "${BLUE}  Frontend URL: http://localhost:${FRONTEND_PORT}"
echo -e "${BLUE}  Backend URL: http://localhost:${BACKEND_PORT}"

# --- Step 4: User Interaction Loop ---
echo -e "Enter 'q' or 'exit' to stop all services.${NC}"

while true; do
    read -p "> " command_input
    case "$command_input" in
        q|Q|exit|EXIT)
            stop_all_services
            break
            ;;
        *)
            echo -e "Unknown command. Enter 'q' or 'exit' to quit.${NC}"
            ;;
    esac
done

echo -e "${GREEN}Goodbye!${NC}"