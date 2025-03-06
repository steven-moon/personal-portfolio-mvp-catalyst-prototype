#!/bin/sh

# Set maximum retries
MAX_RETRIES=3
RETRY_COUNT=0

# Function to start the application with retry logic
start_app() {
  while [ $RETRY_COUNT -lt $MAX_RETRIES ]
  do
    echo "Starting frontend application (attempt $(($RETRY_COUNT + 1))/$MAX_RETRIES)..."
    
    # Clear node_modules/.vite if it exists (can sometimes cause issues)
    if [ -d "node_modules/.vite" ]; then
      echo "Clearing Vite cache..."
      rm -rf node_modules/.vite
    fi
    
    # Try to start the application
    npm run dev:safe
    
    # Check if the application failed
    EXIT_CODE=$?
    
    if [ $EXIT_CODE -eq 0 ]; then
      echo "Application exited cleanly."
      return 0
    else
      echo "Application crashed with exit code $EXIT_CODE"
      RETRY_COUNT=$(($RETRY_COUNT + 1))
      
      if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
        echo "Waiting 5 seconds before retrying..."
        sleep 5
      else
        echo "Maximum retries reached. Aborting."
        return 1
      fi
    fi
  done
}

# Ensure node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the application
start_app

# If all retries failed, serve a static message
if [ $? -ne 0 ]; then
  echo "<!DOCTYPE html><html><head><title>Frontend Starting</title></head><body><h1>Frontend is having trouble starting</h1><p>Please check the container logs for details.</p></body></html>" > index.html
  echo "Serving static message on port 8080..."
  npx serve -s . -p 8080
fi 