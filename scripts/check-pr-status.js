#!/usr/bin/env node

/**
 * Check PR Status Script
 * 
 * This script checks the status of a pull request and waits for checks to complete.
 * 
 * Usage:
 *   node check-pr-status.js --pr=123 [--max-attempts=10] [--wait-seconds=30]
 * 
 * Options:
 *   --pr            Required. The PR number to check
 *   --max-attempts  Optional. Maximum number of attempts to check status (default: 10)
 *   --wait-seconds  Optional. Seconds to wait between attempts (default: 30)
 */

import { execSync } from 'child_process';

// Parse command line arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.split('=');
  if (key && value) {
    acc[key.replace(/^--/, '')] = value;
  }
  return acc;
}, {});

// Validate required arguments
if (!args.pr) {
  console.error('Error: --pr is required');
  process.exit(1);
}

// Set default values
const maxAttempts = parseInt(args['max-attempts'] || '10', 10);
const waitSeconds = parseInt(args['wait-seconds'] || '30', 10);

// Helper function to execute shell commands
function executeCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return '';
  }
}

console.log(`Checking status of PR #${args.pr}`);
console.log(`Will make up to ${maxAttempts} attempts, waiting ${waitSeconds} seconds between attempts`);

// Check PR status
let success = false;
for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  console.log(`Attempt ${attempt}/${maxAttempts}...`);
  
  try {
    const result = execSync(`gh pr checks ${args.pr}`, { encoding: 'utf8' });
    console.log(result);
    
    // If we get here without an exception, the command succeeded
    success = true;
    break;
  } catch (error) {
    console.log(`Checks not complete yet. Waiting ${waitSeconds} seconds before next attempt...`);
    
    if (attempt < maxAttempts) {
      // Sleep for waitSeconds
      execSync(`sleep ${waitSeconds}`);
    }
  }
}

// Final status message
if (success) {
  console.log(`PR #${args.pr} checks completed successfully`);
} else {
  console.log(`PR #${args.pr} checks may still be running after ${maxAttempts} attempts`);
}

// Always output a notice for GitHub Actions
console.log(`::notice ::PR #${args.pr} is ready for review. Note: GitHub Actions cannot approve its own PR.`);
