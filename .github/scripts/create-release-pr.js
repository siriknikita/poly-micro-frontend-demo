#!/usr/bin/env node

/**
 * Create Release PR Script
 * 
 * This script creates a pull request for a release update and returns the PR number.
 * It handles all the complexity of creating a PR and extracting the PR number.
 * 
 * Usage:
 *   node create-release-pr.js --version=1.3.0 [--branch=release-update-v1.3.0] [--base=main]
 * 
 * Options:
 *   --version     Required. The version number (e.g., 1.3.0)
 *   --branch      Optional. The branch name (default: release-update-v{version})
 *   --base        Optional. The base branch to create PR against (default: main)
 */

import { execSync } from 'child_process';
import fs from 'fs';

// Parse command line arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.split('=');
  if (key && value) {
    acc[key.replace(/^--/, '')] = value;
  }
  return acc;
}, {});

// Validate required arguments
if (!args.version) {
  console.error('Error: --version is required');
  process.exit(1);
}

// Set default values
const branch = args.branch || `release-update-v${args.version}`;
const base = args.base || 'main';

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

// Create PR title
const prTitle = `Feat: Update release notes for v${args.version}`;
const prBody = `This PR updates the release notes for version v${args.version}.\n\nAutomated PR created by GitHub Actions Bot.`;

// Create PR using GitHub CLI
console.log(`Creating PR for branch ${branch} against ${base}...`);
const prOutput = executeCommand(`gh pr create --base ${base} --head "${branch}" --title "${prTitle}" --body "${prBody}"`);

// Extract PR number from the URL
console.log(`PR Output: ${prOutput}`);
let prNumber = '';

if (prOutput) {
  // Try to extract PR number from URL (e.g., https://github.com/owner/repo/pull/123)
  prNumber = prOutput.match(/[0-9]+$/)?.[0] || '';
}

// If extraction failed, try to get it from the repo directly
if (!prNumber) {
  console.log('Could not extract PR number from URL, fetching from open PRs...');
  
  // First, try with a simpler approach that works with older gh cli versions
  const prList = executeCommand(`gh pr list --head "${branch}"`);
  prNumber = prList.split(/\s+/)[0];
  
  // If that fails, try directly checking the GitHub API
  if (!prNumber) {
    console.log('Still no PR number. Getting from GitHub API using curl...');
    const repoInfo = executeCommand('echo $GITHUB_REPOSITORY');
    const apiOutput = executeCommand(
      `curl -s -H "Authorization: token $GH_TOKEN" "https://api.github.com/repos/${repoInfo}/pulls?head=${repoInfo.split('/')[0]}:${branch}&state=open"`
    );
    
    try {
      const prData = JSON.parse(apiOutput);
      if (prData.length > 0) {
        prNumber = prData[0].number;
      }
    } catch (error) {
      console.error('Error parsing API response:', error.message);
    }
  }
}

if (prNumber) {
  console.log(`PR Number: ${prNumber}`);
  // Output PR number to be captured by GitHub Actions
  console.log(`::set-output name=pr_number::${prNumber}`);
} else {
  console.error('Failed to extract PR number');
  process.exit(1);
}
