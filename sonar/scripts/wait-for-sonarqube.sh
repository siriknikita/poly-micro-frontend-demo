#!/bin/bash

set -e

echo "Waiting for SonarQube (poly-micro-sonarqube) to be ready..."
# Wait for SonarQube to be up and running
MAX_RETRIES=30
RETRY=0

while [ $RETRY -lt $MAX_RETRIES ]; do
  if curl -s -f -u "${SONAR_LOGIN}:${SONAR_PASSWORD}" "${SONAR_HOST_URL}/api/system/status" | grep -q '"status":"UP"'; then
    echo "SonarQube is up and running!"
    break
  fi
  
  RETRY=$((RETRY+1))
  echo "SonarQube is not ready yet. Waiting... ($RETRY/$MAX_RETRIES)"
  sleep 10
  
  if [ $RETRY -eq $MAX_RETRIES ]; then
    echo "Failed to connect to SonarQube after $MAX_RETRIES attempts."
    exit 1
  fi
done

# Check if the project already exists
echo "Checking if project exists..."
PROJECT_EXISTS=$(curl -s -u "${SONAR_LOGIN}:${SONAR_PASSWORD}" "${SONAR_HOST_URL}/api/projects/search?q=poly-micro-frontend" | grep -c "poly-micro-frontend" || true)

if [ "$PROJECT_EXISTS" -eq 0 ]; then
  echo "Creating SonarQube project..."
  curl -s -u "${SONAR_LOGIN}:${SONAR_PASSWORD}" -X POST "${SONAR_HOST_URL}/api/projects/create" \
    -d "name=poly-micro-frontend" \
    -d "project=poly-micro-frontend"
else
  echo "Project already exists in SonarQube."
fi

# Prepare TypeScript configuration for SonarQube scan
echo "Preparing TypeScript configuration for SonarQube scan..."
/usr/src/sonar/scripts/prepare-tsconfig-for-sonar.sh

# Run SonarScanner using our custom properties file
echo "Running SonarScanner analysis..."

# Run sonar-scanner with the custom properties file
sonar-scanner \
  -Dproject.settings=/usr/src/sonar/config/sonar-scanner.properties \
  -Dsonar.host.url="${SONAR_HOST_URL}" \
  -Dsonar.login="${SONAR_LOGIN}" \
  -Dsonar.password="${SONAR_PASSWORD}"

# Restore original TypeScript configuration
echo "Restoring original TypeScript configuration..."
/usr/src/sonar/scripts/restore-tsconfig-after-sonar.sh

echo "SonarQube analysis completed!"
