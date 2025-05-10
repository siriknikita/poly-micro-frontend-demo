#!/bin/bash

# This script restores the original TypeScript configuration files
# after the SonarQube scan completes

echo "Restoring original TypeScript configuration..."

# Remove the symlink
if [ -L "/usr/src/tsconfig.json" ]; then
  rm /usr/src/tsconfig.json
  echo "Removed temporary tsconfig.json symlink"
fi

# Restore original tsconfig files
if [ -f "/usr/src/tsconfig.json.bak" ]; then
  mv /usr/src/tsconfig.json.bak /usr/src/tsconfig.json
  echo "Restored original tsconfig.json"
fi

if [ -f "/usr/src/tsconfig.app.json.bak" ]; then
  mv /usr/src/tsconfig.app.json.bak /usr/src/tsconfig.app.json
  echo "Restored original tsconfig.app.json"
fi

if [ -f "/usr/src/tsconfig.node.json.bak" ]; then
  mv /usr/src/tsconfig.node.json.bak /usr/src/tsconfig.node.json
  echo "Restored original tsconfig.node.json"
fi

echo "TypeScript configuration restoration complete."
