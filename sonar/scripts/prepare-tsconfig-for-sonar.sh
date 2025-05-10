#!/bin/bash

# This script temporarily renames the project's TypeScript configuration files
# to prevent SonarQube scanner from trying to use them

echo "Preparing TypeScript configuration for SonarQube scan..."

# Move original tsconfig files
if [ -f "/usr/src/tsconfig.json" ]; then
  mv /usr/src/tsconfig.json /usr/src/tsconfig.json.bak
  echo "Moved tsconfig.json to tsconfig.json.bak"
fi

if [ -f "/usr/src/tsconfig.app.json" ]; then
  mv /usr/src/tsconfig.app.json /usr/src/tsconfig.app.json.bak
  echo "Moved tsconfig.app.json to tsconfig.app.json.bak"
fi

if [ -f "/usr/src/tsconfig.node.json" ]; then
  mv /usr/src/tsconfig.node.json /usr/src/tsconfig.node.json.bak
  echo "Moved tsconfig.node.json to tsconfig.node.json.bak"
fi

# Create a symlink to our SonarQube-compatible TypeScript configuration
ln -sf /usr/src/sonar/config/sonar-tsconfig-compat.json /usr/src/tsconfig.json
echo "Created symlink from sonar-tsconfig-compat.json to tsconfig.json"

echo "TypeScript configuration preparation complete."
