#!/usr/bin/env node

/**
 * Script to run tests with proper configuration
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define test types
const TEST_TYPES = {
  UNIT: 'unit',
  INTEGRATION: 'integration',
  E2E: 'e2e',
  ALL: 'all',
};

// Parse command line arguments
const args = process.argv.slice(2);
const testType = args[0] || TEST_TYPES.UNIT;
const testPath = args[1] || '';
const watch = args.includes('--watch');

// Validate test type
if (!Object.values(TEST_TYPES).includes(testType)) {
  console.error(`Invalid test type: ${testType}`);
  console.error(`Valid test types: ${Object.values(TEST_TYPES).join(', ')}`);
  process.exit(1);
}

// Set up test patterns based on test type
let testPattern;
switch (testType) {
  case TEST_TYPES.UNIT:
    testPattern = '**/__tests__/**/*.test.[jt]s?(x)';
    break;
  case TEST_TYPES.INTEGRATION:
    testPattern = '**/__tests__/**/*.integration.test.[jt]s?(x)';
    break;
  case TEST_TYPES.E2E:
    testPattern = '**/e2e/**/*.test.[jt]s?(x)';
    break;
  case TEST_TYPES.ALL:
    testPattern = '**/*.test.[jt]s?(x)';
    break;
}

// Build the command
let command = `jest ${testPath || testPattern} --config=jest.config.js`;

if (watch) {
  command += ' --watch';
}

// Add coverage reporting for non-watch mode
if (!watch) {
  command += ' --coverage';
}

// Execute the command
try {
  console.log(`Running ${testType} tests...`);
  console.log(`Command: ${command}`);
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error('Tests failed with error:', error.message);
  process.exit(1);
}
