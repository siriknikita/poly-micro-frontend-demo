#!/bin/bash

# Make the script exit on any error
set -e

# Clean up any previous containers
echo "Cleaning up any previous SonarQube containers..."
docker-compose -f docker-compose.sonarqube.yml down -v 2>/dev/null || true

# Generate coverage reports first
echo "Generating test coverage reports..."
npm run test:coverage

# Create coverage directory if it doesn't exist
mkdir -p coverage

# Start SonarQube
echo "Starting SonarQube..."
docker-compose -f docker-compose.sonarqube.yml up -d sonarqube

# Wait for SonarQube to be fully up (can take a minute or two)
echo "Waiting for SonarQube to be fully up and running..."
echo "This may take a minute or two..."

# Check if SonarQube is up
echo "Checking if SonarQube is up..."
MAX_RETRIES=30
RETRIES=0

until curl -s http://localhost:9000/api/system/status | grep -q '"status":"UP"' || [ $RETRIES -eq $MAX_RETRIES ]; do
  echo "Waiting for SonarQube to start... ($RETRIES/$MAX_RETRIES)"
  sleep 10
  RETRIES=$((RETRIES+1))
done

if [ $RETRIES -eq $MAX_RETRIES ]; then
  echo "SonarQube failed to start in the expected time."
  echo "Please check the logs with: docker-compose -f docker-compose.sonarqube.yml logs sonarqube"
  exit 1
fi

echo "SonarQube is up and running!"

# Build and run the SonarScanner
echo "Building and running SonarScanner..."
docker-compose -f docker-compose.sonarqube.yml up --build sonarscanner

echo ""
echo "SonarQube is running at http://localhost:9000"
echo "Default credentials: admin/admin"
echo "You may need to change the password on first login"
echo ""
echo "To stop SonarQube, run: docker-compose -f docker-compose.sonarqube.yml down -v"
