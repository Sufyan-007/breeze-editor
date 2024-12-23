#!/bin/bash

# Check if pip3 is installed, if not install it
if ! command -v pip3 &> /dev/null; then
    echo "pip3 could not be found, installing pip3..."
    sudo apt-get update
    sudo apt-get install -y python3-pip
fi

# Function to check if a package is installed in the virtual environment
check_virtualenv_installed() {
    source "../venv/bin/activate"
    if ! pip3 show virtualenv &> /dev/null; then
        echo "virtualenv is not installed, installing it..."
        pip3 install virtualenv
    fi
}

# Check if venv folder exists
if [ ! -d "../venv" ]; then
    echo "Virtual environment not found, creating one..."
    python3 -m pip3 install --user virtualenv
    python3 -m virtualenv "../venv"
    check_virtualenv_installed
else
    check_virtualenv_installed
fi

# Activate the virtual environment
source "../venv/bin/activate"

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

# Get the current working directory
BASE_DIR=$(pwd)

# Install Python dependencies
pip3 install -r "$BASE_DIR/requirements.txt"

# Install JS dependencies for third_party_package_parser and breeze_client
echo "Installing JavaScript dependencies..."
npm install --prefix "$BASE_DIR/third_party_package_parser/"
npm install --prefix "$BASE_DIR/breeze_client/"

# Make configuration directory
mkdir -p "$BASE_DIR/configurations"

# Start breeze_server server
echo "Starting breeze_server server in staging mode..."
export RUN_ENV=staging
nohup python3 breeze_server/manage.py runserver > "$BASE_DIR/breeze_server.log" 2>&1 &
BREEZE_SERVER_PID=$!

# Start third_party_package_parser server
echo "Starting third_party_package_parser server in staging mode..."
nohup npm run staging --prefix "$BASE_DIR/third_party_package_parser/" > "$BASE_DIR/third_party_package_parser.log" 2>&1 &
THIRD_PARTY_PACKAGE_PARSER_PID=$!

# Start breeze_client server
echo "Starting breeze_client server in staging mode..."
nohup npm run staging --prefix "$BASE_DIR/breeze_client/" > "$BASE_DIR/breeze_client.log" 2>&1 &
BREEZE_CLIENT_PID=$!

# Script exits here while background processes keep running
echo "All servers are started and running in the background."
exit 0
