#!/bin/bash

# Start the web server
python3 server.py &

# Wait for the server to start
sleep 2

# Open the URL in the default web browser
xdg-open http://127.0.0.1:8080/