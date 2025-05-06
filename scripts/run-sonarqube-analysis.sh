#!/bin/bash

set -e

echo "Running tests with coverage..."
npm run test:coverage

echo "Starting SonarQube analysis..."
docker-compose -f docker-compose.sonarqube.yml up --build
