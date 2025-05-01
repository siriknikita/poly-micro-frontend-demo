# SonarQube & SonarScanner Integration

This documentation provides detailed information about the SonarQube and SonarScanner integration in the Poly Micro Manager frontend application.

## Overview

[SonarQube](https://www.sonarqube.org/) is an open-source platform for continuous inspection of code quality to perform automatic reviews with static analysis of code to detect bugs, code smells, and security vulnerabilities. SonarScanner is the command-line tool used to analyze a project and send the results to SonarQube.

## Features

- **Code Quality Analysis**: Identifies bugs, vulnerabilities, and code smells
- **Security Vulnerability Detection**: Identifies security issues in your code
- **Code Coverage Tracking**: Tracks test coverage for your codebase
- **Technical Debt Management**: Helps identify and manage technical debt
- **CI/CD Integration**: Seamlessly integrates with your CI/CD pipeline

## Prerequisites

- SonarQube server (can be self-hosted or SonarCloud)
- Node.js (v16+)
- npm or yarn

## Setup Instructions

### 1. SonarQube Server Setup

#### Option A: Using SonarCloud (Recommended for teams)

1. Create an account on [SonarCloud](https://sonarcloud.io/)
2. Create a new organization or join an existing one
3. Create a new project for your repository
4. Generate a token for authentication

#### Option B: Self-hosted SonarQube (For enterprise environments)

1. Download SonarQube from the [official website](https://www.sonarqube.org/downloads/)
2. Install and run SonarQube following the [installation guide](https://docs.sonarqube.org/latest/setup/install-server/)
3. Access SonarQube at `http://localhost:9000` (default)
4. Create a new project and generate a token

### 2. SonarScanner Installation

#### Global Installation

```bash
npm install -g sonar-scanner
```

#### Project-level Installation

```bash
npm install --save-dev sonar-scanner
```

### 3. Project Configuration

Create a `sonar-project.properties` file in the root of your project:

```properties
# Project identification
sonar.projectKey=poly-micro-frontend-demo
sonar.projectName=Poly Micro Frontend Demo
sonar.projectVersion=1.0.0

# Source code location
sonar.sources=src
sonar.tests=src/__tests__

# Exclude files from analysis
sonar.exclusions=node_modules/**,**/*.test.tsx,**/*.test.ts,**/*.stories.tsx

# Test configuration
sonar.test.inclusions=**/*.test.tsx,**/*.test.ts
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Encoding of the source code
sonar.sourceEncoding=UTF-8
```

## GitHub Actions Integration

To automatically run SonarQube analysis on every pull request and push to the main branch, add the following GitHub Actions workflow file:

```yaml
name: SonarQube Analysis

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch: # Allow manual triggering

jobs:
  sonarqube:
    name: SonarQube Analysis
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Fetch all history for proper SCM integration
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests with coverage
        run: npm run test:coverage
      
      - name: SonarQube Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

Make sure to add your `SONAR_TOKEN` to your GitHub repository secrets.

## Running SonarScanner Locally

To run the SonarScanner locally:

1. Generate code coverage report:
   ```bash
   npm run test:coverage
   ```

2. Run SonarScanner:
   ```bash
   sonar-scanner
   ```

3. View results on your SonarQube server or SonarCloud.

## Understanding SonarQube Reports

SonarQube provides several metrics to assess your code quality:

### 1. Quality Gate

The Quality Gate is a set of conditions that determines whether your code meets the quality requirements. It can be:
- **Passed**: Your code meets all conditions
- **Failed**: Your code doesn't meet one or more conditions

### 2. Key Metrics

- **Bugs**: Code issues that represent potential bugs
- **Vulnerabilities**: Security issues in your code
- **Code Smells**: Maintainability issues
- **Coverage**: Percentage of code covered by tests
- **Duplications**: Percentage of duplicated code
- **Technical Debt**: Estimated time to fix all code smells

### 3. Issue Severity Levels

- **Blocker**: Issues that must be fixed immediately
- **Critical**: Issues that should be addressed as soon as possible
- **Major**: Issues of significant concern
- **Minor**: Issues of minor concern
- **Info**: Informational issues

## Best Practices

1. **Run analysis regularly**: Incorporate SonarQube analysis into your daily development workflow
2. **Fix issues incrementally**: Address issues systematically, focusing on high-severity ones first
3. **Maintain high test coverage**: Aim for at least 80% test coverage
4. **Use Quality Gates**: Set up quality gates to prevent merging code with serious issues
5. **Review SonarQube reports before merging**: Make SonarQube analysis part of your code review process
6. **Set up custom rules**: Configure SonarQube to match your project's specific requirements

## Troubleshooting

### Common Issues and Solutions

1. **Connection Errors**:
   - Ensure your SONAR_TOKEN is correctly set
   - Check that your SonarQube server is accessible

2. **Analysis Fails**:
   - Check SonarQube logs for details
   - Ensure you have sufficient permissions

3. **Coverage Not Showing**:
   - Verify the path to coverage report is correct
   - Ensure tests are generating coverage reports properly

## References

- [SonarQube Documentation](https://docs.sonarqube.org/latest/)
- [SonarScanner Documentation](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/)
- [SonarQube JavaScript Rules](https://rules.sonarsource.com/javascript/)
