#!/bin/bash

# Script to run E2E tests using Docker

# Default values
REBUILD=false
TEST_FILE=""
HEADLESS=true
DEBUG=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --rebuild)
      REBUILD=true
      shift
      ;;
    --test)
      TEST_FILE="$2"
      shift 2
      ;;
    --headed)
      HEADLESS=false
      shift
      ;;
    --debug)
      DEBUG=true
      shift
      ;;
    --help)
      echo "Usage: ./run-e2e-tests.sh [options]"
      echo "Options:"
      echo "  --rebuild       Rebuild the Docker container (use after Dockerfile or package.json changes)"
      echo "  --test FILE     Run specific test file (e.g., --test e2e/basic.spec.ts)"
      echo "  --headed        Run tests in headed mode (shows browser UI)"
      echo "  --debug         Run tests with debugging enabled"
      echo "  --help          Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help to see available options"
      exit 1
      ;;
  esac
done

# Prepare the command
if [ "$REBUILD" = true ]; then
  BUILD_ARG="--build"
else
  BUILD_ARG=""
fi

# Prepare the test command
TEST_CMD="npm run test:e2e"

if [ -n "$TEST_FILE" ]; then
  TEST_CMD="npx playwright test $TEST_FILE --project=chromium"
fi

if [ "$HEADLESS" = false ]; then
  TEST_CMD="$TEST_CMD --headed --trace on"
fi

if [ "$DEBUG" = true ]; then
  TEST_CMD="$TEST_CMD --debug"
fi

# Override the default command in docker-compose
export PLAYWRIGHT_TEST_COMMAND="$TEST_CMD"

# Build and run the Docker container
echo "Running E2E tests in Docker..."
echo "Command: $TEST_CMD"

if [ "$REBUILD" = true ]; then
  echo "Rebuilding container..."
fi

docker-compose up $BUILD_ARG --force-recreate

# Check the exit code
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ E2E tests completed successfully!"
  echo "Test reports are available in the playwright-report directory"
else
  echo "❌ E2E tests failed with exit code: $EXIT_CODE"
  echo "Check the test reports in the playwright-report directory for details"
fi

exit $EXIT_CODE
