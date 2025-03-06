FROM node:18.17.1-alpine3.18

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN apk add --no-cache python3 make g++ && \
    npm install && \
    apk del python3 make g++

# Copy the rest of the application
COPY . .

# Make the startup script executable
RUN chmod +x startup.sh

# Expose the port the app runs on
EXPOSE 8080

# Set Node.js options for increased memory and stability
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Command to run the application with retry logic
CMD ["./startup.sh"] 