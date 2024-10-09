#!/bin/bash

# Function to check if a port is in use and kill the process
kill_port() {
    local port=$1
    if lsof -i:$port; then
        echo "Port $port is in use. Killing the process..."
        # Get the process ID (PID) using the port and kill it
        lsof -ti:$port | xargs kill -9
    else
        echo "Port $port is free."
    fi
}

# Define the ports you want to check and use
THIRD_PARTY_PACKAGE_PARSER_PORT=4000
BREEZE_CLIENT_PORT=5173
BREEZE_SERVER_PORT=8000

# Kill any processes using the specified ports
kill_port $THIRD_PARTY_PACKAGE_PARSER_PORT
kill_port $BREEZE_CLIENT_PORT
kill_port $BREEZE_SERVER_PORT

# Start Python server
echo "Starting Python server in development mode..."
export RUN_ENV=dev
python3 breeze_server/manage.py runserver &

# Start Node.js server
echo "Starting Node.js server in development mode..."
npm run dev --prefix ./third_party_package_parser/ &

# start breeze_client server
npm run dev --prefix ./breeze_client/ &

# Wait for all 3 servers to start
wait
