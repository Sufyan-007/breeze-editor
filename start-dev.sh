#!/bin/bash


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
