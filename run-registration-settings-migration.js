#!/usr/bin/env node

// This script runs the registration settings migration
// Usage: node run-registration-settings-migration.js

const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

const migrationFile = path.join(__dirname, 'migrations', 'add-registration-settings.sql');

if (!fs.existsSync(migrationFile)) {
  console.error(`ERROR: Migration file not found: ${migrationFile}`);
  process.exit(1);
}

async function runMigration() {
  try {
    console.log('Running migration to add registration_settings table...');
    
    const sql = neon(DATABASE_URL);
    const migrationSQL = fs.readFileSync(migrationFile, 'utf8');
    
    // Execute the migration
    await sql(migrationSQL);
    
    console.log('✅ Migration completed successfully');
    console.log('Registration settings table created with default values');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
