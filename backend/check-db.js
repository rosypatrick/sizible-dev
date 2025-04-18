/**
 * Script to check database data
 */

const supabase = require('./src/utils/supabaseClient');

async function checkData() {
  try {
    console.log('Checking garments_excel table...');
    const { data, error, count } = await supabase
      .from('garments_excel')
      .select('*', { count: 'exact' });
    
    console.log(`Garments count: ${count}`);
    
    if (data && data.length > 0) {
      console.log('First record:', JSON.stringify(data[0], null, 2));
    } else {
      console.log('No data found in garments_excel');
    }
    
    console.log('Error:', error);
    
    // Check upload_logs table
    console.log('\nChecking upload_logs table...');
    const { data: logs, error: logError, count: logCount } = await supabase
      .from('upload_logs')
      .select('*', { count: 'exact' });
    
    console.log(`Upload logs count: ${logCount}`);
    
    if (logs && logs.length > 0) {
      console.log('First log:', JSON.stringify(logs[0], null, 2));
    } else {
      console.log('No data found in upload_logs');
    }
    
    console.log('Error:', logError);
  } catch (err) {
    console.error('Error checking database:', err);
  }
}

checkData().then(() => process.exit());
