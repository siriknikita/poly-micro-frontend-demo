#!/usr/bin/env node

/**
 * Release Update Script
 * 
 * This script is designed to be run as part of your CI/CD pipeline to automatically
 * update the releases.json file with a new release entry.
 * 
 * Usage:
 *   node update-release.js --version=1.3.0 --title="New Release" [options]
 * 
 * Options:
 *   --version      Required. The version number (e.g., 1.3.0)
 *   --title        Required. The release title
 *   --description  The release description (default: "New release")
 *   --changes      Path to a JSON file containing the changes (default: changes.json)
 *   --file         Path to the releases.json file (default: ../releases/releases.json)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Parse command line arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.split('=');
  if (key && value) {
    acc[key.replace(/^--/, '')] = value;
  }
  return acc;
}, {});

// Validate required arguments
if (!args.version || !args.title) {
  console.error('Error: --version and --title are required');
  process.exit(1);
}

// Set default values
const description = args.description || `Release ${args.version}`;
const changesFile = args.changes || 'changes.json';
// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const releasesFile = args.file || path.join(__dirname, '../releases/releases.json');

// Get current date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Load changes from file if it exists
let changes = [];
try {
  if (fs.existsSync(changesFile)) {
    changes = JSON.parse(fs.readFileSync(changesFile, 'utf8'));
  } else {
    console.warn(`Warning: Changes file ${changesFile} not found, using empty changes array`);
  }
} catch (error) {
  console.error(`Error reading changes file: ${error.message}`);
  process.exit(1);
}

// Create new release object
const newRelease = {
  version: args.version,
  releaseDate: today,
  title: args.title,
  description,
  changes
};

// Load existing releases
let releases = { releases: [] };
try {
  if (fs.existsSync(releasesFile)) {
    releases = JSON.parse(fs.readFileSync(releasesFile, 'utf8'));
  } else {
    console.warn(`Warning: Releases file ${releasesFile} not found, creating new file`);
    // Ensure the directory exists
    const dir = path.dirname(releasesFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
} catch (error) {
  console.error(`Error reading releases file: ${error.message}`);
  process.exit(1);
}

// Check if version already exists
const existingIndex = releases.releases.findIndex(r => r.version === args.version);
if (existingIndex !== -1) {
  console.warn(`Warning: Version ${args.version} already exists, updating it`);
  releases.releases[existingIndex] = newRelease;
} else {
  // Add new release at the beginning (most recent first)
  releases.releases.unshift(newRelease);
}

// Write updated releases back to file
try {
  fs.writeFileSync(releasesFile, JSON.stringify(releases, null, 2));
  console.log(`Successfully updated ${releasesFile} with version ${args.version}`);
} catch (error) {
  console.error(`Error writing releases file: ${error.message}`);
  process.exit(1);
}
