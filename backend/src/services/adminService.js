/**
 * Admin Service
 * 
 * This service provides functions for admin-specific operations such as Excel file processing.
 * It handles the parsing and database updates for product data from Excel files.
 */

const supabase = require('../utils/supabaseClient');
const xlsx = require('xlsx');

/**
 * Process Excel file and update database
 * 
 * @param {Buffer} fileBuffer - The Excel file buffer
 * @param {string} filename - The original filename
 * @param {string} userId - The ID of the user who uploaded the file
 * @returns {Promise<Object>} Processing results
 */
const processExcelFile = async (fileBuffer, filename, userId) => {
  try {
    console.log(`Starting to process Excel file: ${filename}`);
    
    // Parse Excel file
    let workbook, worksheet, data;
    try {
      workbook = xlsx.read(fileBuffer, { type: 'buffer' });
      console.log(`Excel file parsed successfully. Sheets: ${workbook.SheetNames.join(', ')}`);
      
      const firstSheetName = workbook.SheetNames[0];
      worksheet = workbook.Sheets[firstSheetName];
      data = xlsx.utils.sheet_to_json(worksheet);
      
      console.log(`Extracted ${data.length} rows from Excel file`);
      
      // Validate data structure
      if (data.length === 0) {
        throw new Error('Excel file contains no data');
      }
      
      // Check for required columns
      const firstRow = data[0];
      const requiredColumns = ['FE_Item_Code'];
      const missingColumns = requiredColumns.filter(col => !Object.keys(firstRow).includes(col));
      
      if (missingColumns.length > 0) {
        throw new Error(`Excel file is missing required columns: ${missingColumns.join(', ')}`);
      }

      console.log('Excel file has all required columns. Sample row:', JSON.stringify(firstRow, null, 2));
      
      // Create upload log entry
      const { data: logData, error: logError } = await supabase
        .from('upload_logs')
        .insert({
          filename,
          user_id: userId || 'admin',
          created_at: new Date().toISOString(),
          status: 'processing'
        })
        .select('id')
        .single();
      
      if (logError) {
        console.error('Error creating upload log:', logError);
        // If the error is because the table doesn't exist, try to create it
        if (logError.message && logError.message.includes('relation "upload_logs" does not exist')) {
          console.log('Attempting to create upload_logs table...');
          const { error: createTableError } = await supabase.rpc('create_upload_logs_table');
          if (createTableError) {
            console.error('Failed to create upload_logs table:', createTableError);
          } else {
            console.log('upload_logs table created successfully');
          }
        }
        // Continue processing even if we couldn't log it
      }
      
      const logId = logData?.id;
      
      // Process the data
      let successCount = 0;
      let errorCount = 0;
      let updateCount = 0;
      let insertCount = 0;
      
      console.log('Starting to process data rows...');
      
      // Process each row in the Excel file
      for (const row of data) {
        try {
          // Check if the garment already exists
          const { data: existingData, error: existingError } = await supabase
            .from('garments_excel')
            .select('id')
            .eq('FE_Item_Code', row.FE_Item_Code)
            .maybeSingle(); // Use maybeSingle instead of single to avoid errors
          
          if (existingError) {
            console.error(`Database error checking existing garment: ${existingError.message}`);
            errorCount++;
            continue;
          }
          
          // Prepare the garment data - using exact column names from Excel
          const garmentData = {
            "FE_Item_Code": row.FE_Item_Code,
            "Title": row.Title || null,
            "Brand": row.Brand || null,
            "Garment_Type_text": row.Garment_Type_text || null,
            "Garment_Type": row.Garment_Type || null,
            "Garment_Size": row.Garment_Size || null,
            "Color Family": row["Color Family"] || null,
            "Price": row.Price ? row.Price.toString().replace('€', '').trim() : null,
            "Stock": row.Stock || null,
            "Image Src": row["Image Src"] || null,
            "prd_url": row.prd_url || null,
            "Retailer": row.Retailer || null,
            "Material": row.Material || null,
            "Pattern": row.Pattern || null,
            "updated_at": new Date().toISOString()
          };
          
          let result;
          
          // If the garment exists, update it
          if (existingData?.id) {
            console.log(`Updating existing garment: ${row.FE_Item_Code}`);
            const { data: updateData, error: updateError } = await supabase
              .from('garments_excel')
              .update(garmentData)
              .eq('id', existingData.id)
              .select();
            
            if (updateError) {
              console.error(`Error updating garment ${row.FE_Item_Code}:`, updateError);
              errorCount++;
            } else {
              successCount++;
              updateCount++;
              console.log(`Updated garment ${row.FE_Item_Code} successfully`);
            }
          } 
          // Otherwise, insert a new garment
          else {
            console.log(`Inserting new garment: ${row.FE_Item_Code}`);
            garmentData.created_at = new Date().toISOString();
            
            const { data: insertData, error: insertError } = await supabase
              .from('garments_excel')
              .insert(garmentData)
              .select();
            
            if (insertError) {
              console.error(`Error inserting garment ${row.FE_Item_Code}:`, insertError);
              errorCount++;
            } else {
              successCount++;
              insertCount++;
              console.log(`Inserted new garment ${row.FE_Item_Code} successfully`);
            }
          }
        } catch (rowError) {
          console.error(`Error processing row with FE_Item_Code ${row.FE_Item_Code}:`, rowError);
          errorCount++;
        }
      }
      
      console.log(`Processing complete. Success: ${successCount}, Errors: ${errorCount}, Updated: ${updateCount}, Inserted: ${insertCount}`);
      
      // Update the upload log with results
      if (logId) {
        const { error: updateLogError } = await supabase
          .from('upload_logs')
          .update({
            status: errorCount > 0 ? 'partial' : 'success',
            success_count: successCount,
            error_count: errorCount,
            completed_at: new Date().toISOString(),
            details: {
              updated: updateCount,
              inserted: insertCount
            }
          })
          .eq('id', logId);
        
        if (updateLogError) {
          console.error('Error updating upload log:', updateLogError);
        }
      }
      
      return {
        total: data.length,
        success: successCount,
        errors: errorCount,
        updated: updateCount,
        inserted: insertCount,
        logId
      };
    } catch (error) {
      console.error('Excel processing service error:', error);
      throw error;
    }
  } catch (parseError) {
    console.error('Error parsing Excel file:', parseError);
    throw new Error(`Failed to parse Excel file: ${parseError.message}`);
  }
};

/**
 * Get upload history
 * 
 * @returns {Promise<Array>} Upload history records
 */
const getUploadHistory = async () => {
  try {
    const { data, error } = await supabase
      .from('upload_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('Error fetching upload history:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Get upload history service error:', error);
    throw error;
  }
};

module.exports = {
  processExcelFile,
  getUploadHistory
};
