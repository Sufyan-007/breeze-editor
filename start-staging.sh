#!/bin/bash

# Start Python server
echo "Starting Python server in staging mode..."
export RUN_ENV=staging
python3 breeze_server/manage.py runserver &

# Start Node.js server
echo "Starting Node.js server in staging mode..."
npm run staging --prefix ./third_party_package_parser/ &

# start breeze_client server
npm run staging --prefix ./breeze_client/ &

# Wait for all 3 servers to start
wait
