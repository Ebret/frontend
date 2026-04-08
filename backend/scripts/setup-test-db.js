#!/usr/bin/env node

/**
 * Script to set up the test database
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load test environment variables
dotenv.config({ path: '.env.test' });

console.log('Setting up test database...');

try {
  // Create test database if it doesn't exist
  console.log('Creating test database if it doesn\'t exist...');
  
  // Extract database name from connection string
  const dbUrl = process.env.DATABASE_URL;
  const dbName = dbUrl.split('/').pop().split('?')[0];
  
  // Create database command
  const createDbCommand = `npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss`;
  
  // Execute command
  execSync(createDbCommand, { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'test' } });
  
  console.log(`Test database "${dbName}" set up successfully.`);
  
  // Seed the database with test data
  console.log('Seeding test database with test data...');
  execSync('node ./prisma/seed-test.js', { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'test' } });
  
  console.log('Test database seeded successfully.');
} catch (error) {
  console.error('Error setting up test database:', error.message);
  process.exit(1);
}
