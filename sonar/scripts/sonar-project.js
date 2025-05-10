const scanner = require('sonarqube-scanner');

// Authentication can be either token-based or username/password
const auth = process.env.SONARQUBE_TOKEN 
  ? { token: process.env.SONARQUBE_TOKEN }
  : { 
      login: process.env.SONARQUBE_LOGIN || process.env.SONAR_LOGIN,
      password: process.env.SONARQUBE_PASSWORD || process.env.SONAR_PASSWORD
    };

scanner(
  {
    serverUrl: process.env.SONARQUBE_URL || process.env.SONAR_HOST_URL || 'http://localhost:9000',
    ...auth,
    options: {
      'sonar.projectName': 'Poly Micro Frontend Demo',
      'sonar.projectKey': 'poly-micro-frontend',
      'sonar.projectVersion': '1.0.0',
      'sonar.sources': 'src',
      'sonar.tests': 'src/__tests__',
      'sonar.typescript.tsconfigPath': '/usr/src/sonar/config/sonar-tsconfig-compat.json',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.testExecutionReportPaths': 'test-report.xml',
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.exclusions': 'node_modules/**,**/*.test.tsx,**/*.test.ts,**/__tests__/**,**/e2e/**,**/coverage/**,**/dist/**'
    }
  },
  () => process.exit()
);
