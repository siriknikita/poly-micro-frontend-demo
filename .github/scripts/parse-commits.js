#!/usr/bin/env node

/**
 * Parse Commits Script
 * 
 * This script parses git commit messages and generates a changes.json file
 * categorizing commits by type (feature, improvement, fix, breaking).
 * 
 * Usage:
 *   node parse-commits.js [--previous-tag=<tag>] [--output=<file>]
 * 
 * Options:
 *   --previous-tag  Optional. The previous tag to compare against. If not provided,
 *                   the script will try to find the previous tag automatically.
 *   --output        Optional. The output file path (default: changes.json)
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Parse command line arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.split('=');
  if (key && value) {
    acc[key.replace(/^--/, '')] = value;
  }
  return acc;
}, {});

// Set default values
const outputFile = args.output || 'changes.json';

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

// Get previous tag
let previousTag = args['previous-tag'];
if (!previousTag) {
  // Try to find the previous tag automatically
  previousTag = executeCommand('git describe --tags --abbrev=0 HEAD^ 2>/dev/null || echo ""');
}

// Get commits
let commits;
if (!previousTag) {
  // If no previous tag, get all commits
  console.log('No previous tag found, getting all commits');
  commits = executeCommand('git log --pretty=format:"%s" | grep -v "Merge"');
} else {
  // Get commits between the previous tag and the current tag
  console.log(`Getting commits between ${previousTag} and HEAD`);
  commits = executeCommand(`git log ${previousTag}..HEAD --pretty=format:"%s" | grep -v "Merge"`);
}

// Initialize changes array
const changes = [];

// Process feature commits
const features = commits.split('\n').filter(line => line.match(/^feat/i));
features.forEach(line => {
  const description = line.replace(/^feat(\([^)]+\))?:\s*/, '');
  changes.push({
    type: 'feature',
    description
  });
});

// Process improvement commits
const improvements = commits.split('\n').filter(line => 
  line.match(/^improve/i) || line.match(/^refactor/i) || line.match(/^perf/i)
);
improvements.forEach(line => {
  const description = line.replace(/^(improve|refactor|perf)(\([^)]+\))?:\s*/, '');
  changes.push({
    type: 'improvement',
    description
  });
});

// Process fix commits
const fixes = commits.split('\n').filter(line => line.match(/^fix/i));
fixes.forEach(line => {
  const description = line.replace(/^fix(\([^)]+\))?:\s*/, '');
  changes.push({
    type: 'fix',
    description
  });
});

// Process breaking change commits
const breaking = commits.split('\n').filter(line => line.match(/BREAKING CHANGE/i));
breaking.forEach(line => {
  const description = line.replace(/^.*BREAKING CHANGE:\s*/, '');
  changes.push({
    type: 'breaking',
    description
  });
});

// Write changes to file
fs.writeFileSync(outputFile, JSON.stringify(changes, null, 2));
console.log(`Successfully wrote ${changes.length} changes to ${outputFile}`);
