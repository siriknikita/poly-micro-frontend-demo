# SonarQube & SonarScanner Setup Documentation

## Overview

This document describes the SonarQube and SonarScanner setup for the Poly Micro Frontend project. SonarQube is a static code analysis tool that helps identify bugs, vulnerabilities, and code smells in your codebase. Our setup runs SonarQube and SonarScanner in Docker containers, making it easy to analyze code quality without installing additional software on your local machine.

## Architecture

The setup consists of two main components:

1. **SonarQube Server**: Runs the SonarQube application that stores analysis results and provides a web interface to view them.
2. **SonarScanner**: Analyzes the codebase and sends the results to the SonarQube server.

Both components run in separate Docker containers, defined in the `docker-compose.sonarqube.yml` file.

## Files Structure

- `docker-compose.sonarqube.yml` - Docker Compose configuration for SonarQube and SonarScanner
- `Dockerfile.sonarscanner` - Dockerfile for building the SonarScanner image
- `sonar-project.properties` - SonarQube project configuration
- `scripts/wait-for-sonarqube.sh` - Script to wait for SonarQube to be ready before running analysis
- `scripts/run-sonarqube.sh` - Convenience script to run the entire analysis process

## Running Code Analysis

To analyze your code with SonarQube:

```bash
./scripts/run-sonarqube.sh
```

This script will:
1. Clean up any previous SonarQube containers
2. Generate test coverage reports
3. Start the SonarQube server
4. Wait for SonarQube to be fully up and running
5. Run the SonarScanner to analyze your code
6. Make the results available at http://localhost:9000

Default credentials for SonarQube are:
- Username: admin
- Password: admin

You'll be prompted to change the password on first login.

## Viewing Analysis Results

1. Open http://localhost:9000 in your browser
2. Log in with your credentials
3. Navigate to the "Projects" section to see the Poly Micro Frontend project
4. Click on the project to view detailed analysis results

## Configuration Details

### SonarQube Configuration

The SonarQube server is configured in `docker-compose.sonarqube.yml`:

```yaml
sonarqube:
  image: sonarqube:lts
  container_name: sonarqube
  ports:
    - "9000:9000"
  environment:
    - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
  volumes:
    - sonarqube_data:/opt/sonarqube/data
    - sonarqube_logs:/opt/sonarqube/logs
    - sonarqube_extensions:/opt/sonarqube/extensions
```

This configuration:
- Uses the latest LTS version of SonarQube
- Maps port 9000 to access the web interface
- Disables Elasticsearch bootstrap checks for development environments
- Uses Docker volumes to persist data between container restarts

### SonarScanner Configuration

The SonarScanner is configured in `sonar-project.properties`:

```properties
sonar.projectKey=poly-micro-frontend
sonar.projectName=Poly Micro Frontend
sonar.projectVersion=1.0

# Path to source directories
sonar.sources=src
sonar.tests=src/__tests__

# Test file patterns
sonar.test.inclusions=**/*.test.tsx,**/*.test.ts

# Coverage reports
sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Exclude patterns
sonar.exclusions=**/node_modules/**,**/*.test.tsx,**/*.test.ts,**/e2e/**,**/coverage/**,**/dist/**
```

This configuration:
- Sets the project key, name, and version
- Defines source and test directories
- Specifies test file patterns
- Configures coverage report paths
- Excludes certain files and directories from analysis

## Customizing Analysis

### Adding Custom Rules

To add custom rules:

1. Log in to SonarQube
2. Go to Administration > Quality Profiles
3. Create a new profile or clone an existing one
4. Add or modify rules as needed
5. Set your custom profile as the default for your project

### Excluding Files

To exclude additional files from analysis, modify the `sonar.exclusions` property in `sonar-project.properties`:

```properties
sonar.exclusions=**/node_modules/**,**/*.test.tsx,**/*.test.ts,**/e2e/**,**/coverage/**,**/dist/**,**/your-excluded-path/**
```

### Changing Quality Gates

Quality Gates determine when a project is considered passing or failing:

1. Log in to SonarQube
2. Go to Administration > Quality Gates
3. Create a new gate or modify the existing one
4. Set conditions for passing/failing
5. Assign the gate to your project

## Troubleshooting

### SonarQube Won't Start

If SonarQube fails to start:

```bash
docker-compose -f docker-compose.sonarqube.yml logs sonarqube
```

Common issues:
- Insufficient memory: SonarQube requires at least 2GB of RAM
- Port conflict: Ensure port 9000 is not in use by another application

### SonarScanner Fails

If SonarScanner fails:

```bash
docker-compose -f docker-compose.sonarqube.yml logs sonarscanner
```

Common issues:
- SonarQube not ready: The wait script should handle this, but you might need to increase wait time
- Missing coverage reports: Ensure tests are run before analysis
- Permission issues: Check that Docker has permission to access your project files

## Stopping SonarQube

To stop SonarQube and clean up resources:

```bash
docker-compose -f docker-compose.sonarqube.yml down -v
```

The `-v` flag removes volumes, which will delete all analysis data. Omit this flag if you want to preserve data between runs.

## Continuous Integration

To integrate SonarQube analysis in your CI pipeline:

1. Set up a SonarQube server (either self-hosted or SonarCloud)
2. Add the following to your CI configuration:

```yaml
# Example GitHub Actions workflow
sonarqube:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
    - name: Install dependencies
      run: npm ci
    - name: Run tests with coverage
      run: npm run test:coverage
    - name: SonarQube Scan
      uses: SonarSource/sonarqube-scan-action@master
      env:
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

## Conclusion

This SonarQube and SonarScanner setup provides a comprehensive code quality analysis solution for the Poly Micro Frontend project. With an "A" score and zero bugs, the project is in excellent shape. Regular analysis will help maintain high code quality as the project evolves.
