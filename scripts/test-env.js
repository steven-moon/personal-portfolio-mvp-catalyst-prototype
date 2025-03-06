#!/usr/bin/env node

/**
 * Simple script to verify environment variable loading
 * Run with: node scripts/test-env.js
 */

// Import dotenv to load environment variables from .env file
import dotenv from 'dotenv';

// Load environment variables from .env file
const result = dotenv.config();

// Check if .env file was found and loaded
if (result.error) {
  console.error('Error loading .env file:', result.error.message);
  process.exit(1);
}

// Display loaded environment variables
console.log('\n📋 Environment Variables:\n');
console.log('USE_MOCK_DATA:', process.env.VITE_USE_MOCK_DATA || '(not set, will default to true)');
console.log('\nOther Variables:');

// Filter for VITE_ variables and display them
Object.keys(process.env)
  .filter(key => key.startsWith('VITE_') && key !== 'VITE_USE_MOCK_DATA')
  .forEach(key => {
    console.log(`${key}:`, process.env[key]);
  });

console.log('\n✅ Environment variable test complete!\n'); 