#!/bin/bash

# Function to handle termination
terminate() {
    echo "Terminating background process..."
    kill $SERVER_PID
    exit 0
}

# Trap SIGINT signal
trap terminate SIGINT

# Start the web server
python3 server.py &
SERVER_PID=$!

# Wait for the server to start
sleep 2

# Open the URL in the default web browser
xdg-open http://127.0.0.1:8080/

# Wait for the background process to finish
wait $SERVER_PID