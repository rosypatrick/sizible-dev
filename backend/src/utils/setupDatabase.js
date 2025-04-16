/**
 * Database Setup Utility
 * 
 * This utility creates necessary database tables and functions if they don't exist.
 * It should be run when the server starts to ensure all required database objects are available.
 */

const fs = require('fs');
const path = require('path');
const supabase = require('./supabaseClient');

/**
 * Create the necessary database tables using direct SQL
 */
const setupDatabaseTables = async () => {
  try {
    console.log('Setting up database tables...');
    
    // Read the SQL setup script
    const sqlPath = path.join(__dirname, 'setup_database.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL script directly using Supabase's REST API
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        query: sqlScript
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error setting up database tables:', errorText);
      
      // Fallback to using Supabase's built-in query method
      console.log('Trying fallback method for database setup...');
      
      // Split the SQL script into individual statements
      const statements = sqlScript
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      // Execute each statement separately
      for (const statement of statements) {
        const { error } = await supabase.rpc('execute_sql', { sql: statement });
        if (error) {
          console.error(`Error executing SQL: ${error.message}`);
          console.error('Statement:', statement);
        }
      }
    } else {
      console.log('Database tables set up successfully');
    }
    
    // Verify the tables exist by querying them
    const { data: garmentsData, error: garmentsError } = await supabase
      .from('garments')
      .select('count(*)')
      .limit(1);
      
    if (garmentsError) {
      console.error('Error verifying garments table:', garmentsError);
    } else {
      console.log('Garments table verified');
    }
    
    const { data: uploadsData, error: uploadsError } = await supabase
      .from('upload_logs')
      .select('count(*)')
      .limit(1);
      
    if (uploadsError) {
      console.error('Error verifying upload_logs table:', uploadsError);
    } else {
      console.log('Upload_logs table verified');
    }
    
  } catch (error) {
    console.error('Error in database setup:', error);
  }
};

/**
 * Initialize the database by creating all required tables and functions
 */
const initializeDatabase = async () => {
  try {
    await setupDatabaseTables();
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

module.exports = {
  initializeDatabase
};
