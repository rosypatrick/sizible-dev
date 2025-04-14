/**
 * Supabase Client Configuration
 * 
 * This file initializes the Supabase client with the appropriate credentials
 * from environment variables. It exports a single instance of the client to be
 * used throughout the backend application.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize the Supabase client with environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Validate that the environment variables are set
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
  process.exit(1);
}

// Create the Supabase client with service role key for backend operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

module.exports = supabase;
