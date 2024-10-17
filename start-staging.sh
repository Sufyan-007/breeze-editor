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
THIRD_PARTY_PACKAGE_PARSER_PORT=4001
BREEZE_CLIENT_PORT=5174
BREEZE_SERVER_PORT=8001

# Kill any processes using the specified ports
kill_port $THIRD_PARTY_PACKAGE_PARSER_PORT
kill_port $BREEZE_CLIENT_PORT
kill_port $BREEZE_SERVER_PORT

# Start breeze_server server
echo "Starting breeze_server server in staging mode..."
export RUN_ENV=staging
nohup python3 breeze_server/manage.py runserver &> breeze_server.log &

# Start third_party_package_parser server
echo "Starting third_party_package_parser server in staging mode..."
nohup npm run staging --prefix ./third_party_package_parser/ &> third_party_package_parser.log &

# start breeze_client server
nohup npm run staging --prefix ./breeze_client/ &> breeze_client.log &

# Wait for all 3 servers to start
wait
