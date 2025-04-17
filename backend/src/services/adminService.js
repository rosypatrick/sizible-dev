/**
 * Admin Service
 * 
 * This service provides functions for admin-specific operations such as Excel file processing.
 * It handles the parsing and database updates for product data from Excel files.
 */

const supabase = require('../utils/supabaseClient');
const xlsx = require('xlsx');

/**
 * Format a date for display in the UI
 * 
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || 'N/A';
  }
};

/**
 * Safely get a value from an object with fallback
 * 
 * @param {Object} obj - The object to get value from
 * @param {string} key - The key to get
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} The value or default
 */
const safeGet = (obj, key, defaultValue = null) => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  return obj[key] !== undefined ? obj[key] : defaultValue;
};

/**
 * Process Excel file and update database
 * 
 * @param {Buffer} fileBuffer - The Excel file buffer
 * @param {string} filename - The original filename
 * @param {string} userId - The ID of the user who uploaded the file
 * @returns {Promise<Object>} Processing results
 */
const processExcelFile = async (fileBuffer, filename, userId) => {
  // Validate inputs
  if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
    throw new Error('Invalid file buffer provided');
  }
  
  if (!filename || typeof filename !== 'string') {
    throw new Error('Invalid filename provided');
  }
  
  // Initialize tracking variables
  let logId = null;
  let successCount = 0;
  let errorCount = 0;
  
  try {
    console.log(`Starting to process Excel file: ${filename}`);
    
    // Parse Excel file
    let workbook, worksheet, data;
    try {
      workbook = xlsx.read(fileBuffer, { type: 'buffer' });
      console.log(`Excel file parsed successfully. Sheets: ${workbook.SheetNames.join(', ')}`);
      
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('Excel file contains no sheets');
      }
      
      const firstSheetName = workbook.SheetNames[0];
      worksheet = workbook.Sheets[firstSheetName];
      
      if (!worksheet) {
        throw new Error(`Could not access sheet: ${firstSheetName}`);
      }
      
      data = xlsx.utils.sheet_to_json(worksheet);
      
      console.log(`Extracted ${data.length} rows from Excel file`);
      
      // Validate data structure
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Excel file contains no data');
      }
      
      // Check for required columns
      const firstRow = data[0];
      if (!firstRow || typeof firstRow !== 'object') {
        throw new Error('First row is not a valid object');
      }
      
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
        .select();
      
      if (logError) {
        console.error('Error creating upload log:', logError);
        throw new Error(`Failed to create upload log: ${logError.message}`);
      }
      
      if (!logData || !Array.isArray(logData) || logData.length === 0) {
        throw new Error('Failed to create upload log: No log ID returned');
      }
      
      logId = logData[0].id;
      console.log(`Created upload log with ID: ${logId}`);
      
      // Format data for database - handle all possible column names from Excel
      const formattedData = data.map((row, index) => {
        try {
          // Create a new object with all the Excel columns
          const formattedRow = {};
          
          // Map all keys from the Excel row to the database columns
          Object.keys(row).forEach(key => {
            // Use the exact key name from Excel
            formattedRow[key] = row[key];
          });
          
          // Ensure FE_Item_Code is present and convert to string
          if (!row.FE_Item_Code && row.FE_Item_Code !== 0) {
            throw new Error(`Row ${index + 1} is missing FE_Item_Code`);
          }
          
          formattedRow.FE_Item_Code = String(row.FE_Item_Code || '').trim();
          
          if (!formattedRow.FE_Item_Code) {
            throw new Error(`Row ${index + 1} has empty FE_Item_Code after trimming`);
          }
          
          // Add timestamps
          formattedRow.created_at = new Date().toISOString();
          formattedRow.updated_at = new Date().toISOString();
          
          return formattedRow;
        } catch (rowError) {
          console.error(`Error formatting row ${index + 1}:`, rowError);
          errorCount++;
          return null;
        }
      }).filter(Boolean); // Remove any null entries from rows that failed to format
      
      console.log(`Formatted ${formattedData.length} rows for database insertion (${errorCount} rows had formatting errors)`);
      
      if (formattedData.length === 0) {
        throw new Error('No valid rows to insert after formatting');
      }
      
      console.log('Sample formatted row:', JSON.stringify(formattedData[0], null, 2));
      
      // Check if any FE_Item_Codes already exist in the database
      const feItemCodes = formattedData.map(row => row.FE_Item_Code);
      console.log(`Checking for existing records with ${feItemCodes.length} FE_Item_Codes`);
      
      let existingCodes = [];
      try {
        const { data: existingData, error: existingError } = await supabase
          .from('garments_excel')
          .select('FE_Item_Code')
          .in('FE_Item_Code', feItemCodes);
        
        if (existingError) {
          console.error('Error checking existing records:', existingError);
        } else if (existingData && Array.isArray(existingData)) {
          existingCodes = existingData.map(row => row.FE_Item_Code);
          console.log(`Found ${existingCodes.length} existing records with matching FE_Item_Codes`);
        }
      } catch (checkError) {
        console.error('Exception checking existing records:', checkError);
      }
      
      // Insert or update garment data in the database
      // Process in smaller batches to avoid potential issues with large datasets
      const BATCH_SIZE = 50; // Smaller batch size for more reliable processing
      let processedCount = 0;
      
      for (let i = 0; i < formattedData.length; i += BATCH_SIZE) {
        try {
          const batch = formattedData.slice(i, i + BATCH_SIZE);
          const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
          const totalBatches = Math.ceil(formattedData.length / BATCH_SIZE);
          
          console.log(`Processing batch ${batchNumber}/${totalBatches} with ${batch.length} records`);
          
          const { data: upsertData, error: upsertError } = await supabase
            .from('garments_excel')
            .upsert(
              batch,
              { 
                onConflict: 'FE_Item_Code', 
                ignoreDuplicates: false,
                returning: 'minimal' // Don't return the inserted data to improve performance
              }
            );
          
          if (upsertError) {
            console.error(`Error upserting data batch ${batchNumber}:`, upsertError);
            
            // Try to insert records one by one to identify problematic records
            console.log(`Attempting individual inserts for batch ${batchNumber}`);
            
            for (const record of batch) {
              try {
                const { error: singleError } = await supabase
                  .from('garments_excel')
                  .upsert([record], { onConflict: 'FE_Item_Code' });
                  
                if (singleError) {
                  console.error(`Error upserting record with FE_Item_Code ${record.FE_Item_Code}:`, singleError);
                  errorCount++;
                } else {
                  successCount++;
                  processedCount++;
                }
              } catch (singleException) {
                console.error(`Exception upserting record with FE_Item_Code ${record.FE_Item_Code}:`, singleException);
                errorCount++;
              }
            }
          } else {
            console.log(`Successfully upserted batch ${batchNumber} with ${batch.length} records`);
            successCount += batch.length;
            processedCount += batch.length;
          }
          
          // Update progress in the upload log
          if (logId) {
            try {
              await supabase
                .from('upload_logs')
                .update({
                  success_count: successCount,
                  error_count: errorCount
                })
                .eq('id', logId);
            } catch (progressError) {
              console.error('Error updating progress:', progressError);
            }
          }
        } catch (batchError) {
          console.error(`Exception processing batch starting at index ${i}:`, batchError);
          errorCount += Math.min(BATCH_SIZE, formattedData.length - i);
        }
      }
      
      // Verify the total count after upload
      try {
        const { count, error: countError } = await supabase
          .from('garments_excel')
          .select('*', { count: 'exact', head: true });
        
        if (countError) {
          console.error('Error getting count after upload:', countError);
        } else {
          console.log(`Total records in database after upload: ${count}`);
        }
      } catch (countException) {
        console.error('Exception getting count after upload:', countException);
      }
      
      // Update upload log with final results
      if (logId) {
        try {
          const { error: updateLogError } = await supabase
            .from('upload_logs')
            .update({
              completed_at: new Date().toISOString(),
              success_count: successCount,
              error_count: errorCount,
              status: successCount > 0 ? 'success' : 'failed',
              details: { message: `Processed ${successCount} records successfully` }
            })
            .eq('id', logId);
          
          if (updateLogError) {
            console.error('Error updating upload log with final results:', updateLogError);
          }
        } catch (finalUpdateError) {
          console.error('Exception updating upload log with final results:', finalUpdateError);
        }
      }
      
      console.log(`Excel processing completed. Success: ${successCount}, Errors: ${errorCount}`);
      
      return {
        success: successCount,
        errors: errorCount,
        total: data.length
      };
      
    } catch (parseError) {
      console.error('Error parsing Excel file:', parseError);
      
      // Update the log with the error if we have a log ID
      if (logId) {
        try {
          await supabase
            .from('upload_logs')
            .update({
              completed_at: new Date().toISOString(),
              status: 'failed',
              error_count: 1,
              details: { error: parseError.message || 'Unknown error parsing Excel file' }
            })
            .eq('id', logId);
        } catch (logUpdateError) {
          console.error('Error updating log with parse error:', logUpdateError);
        }
      }
      
      throw new Error(`Failed to parse Excel file: ${parseError.message}`);
    }
  } catch (error) {
    console.error('Error in processExcelFile service:', error);
    
    // Update the log with the error
    try {
      await supabase
        .from('upload_logs')
        .update({
          completed_at: new Date().toISOString(),
          status: 'failed',
          error_count: errorCount > 0 ? errorCount : 1,
          details: { error: error.message || 'Unknown error processing Excel file' }
        })
        .eq('id', logId);
    } catch (finalLogError) {
      console.error('Error updating log with final error:', finalLogError);
    }
    
    throw error;
  }
};

/**
 * Get upload history
 * 
 * @returns {Promise<Array>} Array of upload history items
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
      throw new Error('Failed to fetch upload history');
    }
    
    // Format the data for display
    const formattedHistory = data.map(item => ({
      id: item.id,
      filename: item.filename,
      timestamp: formatDate(item.created_at),
      status: item.status,
      records: item.success_count || 0,
      errors: item.error_count || 0,
      details: item.details || {}
    }));
    
    return formattedHistory;
  } catch (error) {
    console.error('Error in getUploadHistory service:', error);
    return [];
  }
};

/**
 * Get dashboard statistics
 * 
 * @returns {Promise<Object>} Dashboard statistics
 */
const getDashboardStats = async () => {
  try {
    console.log('Fetching dashboard statistics...');
    
    // Get total product count
    const { count: productCount, error: productError } = await supabase
      .from('garments_excel')
      .select('*', { count: 'exact', head: true });
    
    if (productError) {
      console.error('Error getting product count:', productError);
      throw new Error('Failed to get product count');
    }
    
    console.log(`Found ${productCount} total products`);
    
    // Get all products to count unique retailers and brands
    const { data: products, error: productsError } = await supabase
      .from('garments_excel')
      .select('Retailer, Brand');
    
    if (productsError) {
      console.error('Error getting products for unique counts:', productsError);
      throw new Error('Failed to get products for unique counts');
    }
    
    // Use Sets to count unique values
    const uniqueRetailers = new Set();
    const uniqueBrands = new Set();
    
    products.forEach(product => {
      if (product.Retailer && typeof product.Retailer === 'string' && product.Retailer.trim()) {
        uniqueRetailers.add(product.Retailer.trim().toLowerCase());
      }
      
      if (product.Brand && typeof product.Brand === 'string' && product.Brand.trim()) {
        uniqueBrands.add(product.Brand.trim().toLowerCase());
      }
    });
    
    console.log(`Found ${uniqueRetailers.size} unique retailers and ${uniqueBrands.size} unique brands`);
    
    // Get recent uploads
    const { data: uploads, error: uploadsError } = await supabase
      .from('upload_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (uploadsError) {
      console.error('Error getting recent uploads:', uploadsError);
      throw new Error('Failed to get recent uploads');
    }
    
    console.log(`Found ${uploads.length} recent uploads`);
    
    const recentUploads = uploads.map(item => ({
      id: item.id,
      filename: item.filename,
      timestamp: formatDate(item.created_at),
      status: item.status,
      records: item.success_count || 0
    }));
    
    const stats = {
      productCount: productCount || 0,
      retailerCount: uniqueRetailers.size || 0,
      brandCount: uniqueBrands.size || 0,
      recentUploads
    };
    
    console.log('Dashboard statistics:', JSON.stringify(stats, null, 2));
    
    return stats;
  } catch (error) {
    console.error('Error in getDashboardStats service:', error);
    return {
      productCount: 0,
      retailerCount: 0,
      brandCount: 0,
      recentUploads: []
    };
  }
};

/**
 * Get unique brands from the database
 * 
 * @returns {Array} Array of unique brands
 */
const getBrands = async () => {
  try {
    // Get all unique brands from the database
    const { data: brandData, error } = await supabase
      .from('garments_excel')
      .select('Brand')
      .not('Brand', 'is', null);
    
    if (error) {
      console.error('Error fetching brands:', error);
      throw new Error('Failed to fetch brands');
    }
    
    // Use a Map to ensure uniqueness by case-insensitive brand name
    const uniqueBrands = new Map();
    
    brandData.forEach(item => {
      if (item.Brand) {
        const brand = item.Brand.trim();
        if (brand) {
          uniqueBrands.set(brand.toLowerCase(), {
            id: brand,
            name: brand
          });
        }
      }
    });
    
    // Convert to array and sort alphabetically
    const brandsArray = Array.from(uniqueBrands.values());
    brandsArray.sort((a, b) => a.name.localeCompare(b.name));
    
    console.log(`Found ${brandsArray.length} unique brands`);
    return brandsArray;
  } catch (error) {
    console.error('Get brands service error:', error);
    // Return default values in case of error
    return [
      { id: 'Joseph Ribkoff', name: 'Joseph Ribkoff' },
      { id: 'Vero Moda', name: 'Vero Moda' }
    ];
  }
};

/**
 * Get unique garment types from the database
 * 
 * @returns {Array} Array of unique garment types
 */
const getGarmentTypes = async () => {
  try {
    // Get all unique garment types from the database
    const { data: garmentTypeData, error } = await supabase
      .from('garments_excel')
      .select('Garment_Type')
      .not('Garment_Type', 'is', null);
    
    if (error) {
      console.error('Error fetching garment types:', error);
      throw new Error('Failed to fetch garment types');
    }
    
    // Use a Map to ensure uniqueness by case-insensitive garment type
    const uniqueGarmentTypes = new Map();
    
    garmentTypeData.forEach(item => {
      if (item.Garment_Type) {
        const type = item.Garment_Type.trim();
        if (type) {
          // Use lowercase as key for case-insensitive uniqueness
          uniqueGarmentTypes.set(type.toLowerCase(), {
            id: type,
            name: type
          });
        }
      }
    });
    
    // Convert to array and sort alphabetically
    const garmentTypesArray = Array.from(uniqueGarmentTypes.values());
    garmentTypesArray.sort((a, b) => a.name.localeCompare(b.name));
    
    console.log(`Found ${garmentTypesArray.length} unique garment types`);
    return garmentTypesArray;
  } catch (error) {
    console.error('Get garment types service error:', error);
    // Return default values in case of error
    return [
      { id: 'Dress', name: 'Dress' },
      { id: 'Top', name: 'Top' },
      { id: 'Pants', name: 'Pants' },
      { id: 'Skirt', name: 'Skirt' },
      { id: 'Jacket', name: 'Jacket' }
    ];
  }
};

/**
 * Get unique retailers from the database
 * 
 * @returns {Array} Array of unique retailers
 */
const getRetailers = async () => {
  try {
    // Get all unique retailers from the database
    const { data: retailerData, error } = await supabase
      .from('garments_excel')
      .select('Retailer')
      .not('Retailer', 'is', null);
    
    if (error) {
      console.error('Error fetching retailers:', error);
      throw new Error('Failed to fetch retailers');
    }
    
    // Use a Map to ensure uniqueness by case-insensitive retailer name
    const uniqueRetailers = new Map();
    
    retailerData.forEach(item => {
      if (item.Retailer) {
        const retailer = item.Retailer.trim();
        if (retailer) {
          uniqueRetailers.set(retailer.toLowerCase(), {
            id: retailer,
            name: retailer
          });
        }
      }
    });
    
    // Convert to array and sort alphabetically
    const retailersArray = Array.from(uniqueRetailers.values());
    retailersArray.sort((a, b) => a.name.localeCompare(b.name));
    
    console.log(`Found ${retailersArray.length} unique retailers`);
    return retailersArray;
  } catch (error) {
    console.error('Get retailers service error:', error);
    // Return default values in case of error
    return [
      { id: 'Nordstrom', name: 'Nordstrom' },
      { id: 'Bloomingdales', name: 'Bloomingdales' },
      { id: 'Macys', name: 'Macys' }
    ];
  }
};

/**
 * Get unique FE_Item_Codes from the database
 * 
 * @returns {Array} Array of unique FE_Item_Codes
 */
const getItemCodes = async () => {
  try {
    // Get all unique item codes from the database with their titles
    const { data: itemCodeData, error } = await supabase
      .from('garments_excel')
      .select('FE_Item_Code, Title')
      .not('FE_Item_Code', 'is', null);
    
    if (error) {
      console.error('Error fetching item codes:', error);
      throw new Error('Failed to fetch item codes');
    }
    
    // Use a Map to ensure uniqueness
    const uniqueItemCodes = new Map();
    
    itemCodeData.forEach(item => {
      if (item.FE_Item_Code) {
        const code = String(item.FE_Item_Code).trim();
        if (code) {
          const title = item.Title ? String(item.Title).trim() : '';
          const displayName = title ? `${code} - ${title}` : code;
          
          uniqueItemCodes.set(code, {
            id: code,
            name: displayName
          });
        }
      }
    });
    
    // Convert to array and sort by code
    const itemCodesArray = Array.from(uniqueItemCodes.values());
    itemCodesArray.sort((a, b) => a.id.localeCompare(b.id));
    
    console.log(`Found ${itemCodesArray.length} unique item codes`);
    return itemCodesArray;
  } catch (error) {
    console.error('Get item codes service error:', error);
    // Return default values in case of error
    return [
      { id: 'JR001', name: 'JR001 - Black Dress' },
      { id: 'JR002', name: 'JR002 - White Blouse' },
      { id: 'VM001', name: 'VM001 - Blue Jeans' }
    ];
  }
};

/**
 * Get unique occasions from the database
 * 
 * @returns {Array} Array of unique occasions
 */
const getOccasions = async () => {
  try {
    // Get all unique occasions from the database
    const { data: occasionData, error } = await supabase
      .from('garments_excel')
      .select('Occasions')
      .not('Occasions', 'is', null);
    
    if (error) {
      console.error('Error fetching occasions:', error);
      throw new Error('Failed to fetch occasions');
    }
    
    // Use a Map to ensure uniqueness by case-insensitive occasion name
    const uniqueOccasions = new Map();
    
    // Process occasions, which may be comma-separated values
    occasionData.forEach(item => {
      if (item.Occasions) {
        const occasions = String(item.Occasions).split(',');
        
        occasions.forEach(occasion => {
          const trimmedOccasion = occasion.trim();
          if (trimmedOccasion) {
            uniqueOccasions.set(trimmedOccasion.toLowerCase(), {
              id: trimmedOccasion,
              name: trimmedOccasion
            });
          }
        });
      }
    });
    
    // Convert to array and sort alphabetically
    const occasionsArray = Array.from(uniqueOccasions.values());
    occasionsArray.sort((a, b) => a.name.localeCompare(b.name));
    
    console.log(`Found ${occasionsArray.length} unique occasions`);
    return occasionsArray;
  } catch (error) {
    console.error('Get occasions service error:', error);
    // Return default values in case of error
    return [
      { id: 'Casual', name: 'Casual' },
      { id: 'Formal', name: 'Formal' },
      { id: 'Business', name: 'Business' },
      { id: 'Party', name: 'Party' },
      { id: 'Wedding', name: 'Wedding' }
    ];
  }
};

/**
 * Get all garment data for filtering dropdowns
 * 
 * @returns {Array} Array of garment data with relevant fields for filtering
 */
const getGarments = async () => {
  try {
    // Get all garment data from the database with only the fields needed for filtering
    const { data: garmentData, error } = await supabase
      .from('garments_excel')
      .select('Retailer, Brand, Garment_Type, Occasions, FE_Item_Code');
    
    if (error) {
      console.error('Error fetching garment data:', error);
      throw new Error('Failed to fetch garment data');
    }
    
    // Process the data to ensure consistent format for filtering
    const processedData = garmentData.map(item => ({
      Retailer: safeGet(item, 'Retailer', ''),
      Brand: safeGet(item, 'Brand', ''),
      Garment_Type: safeGet(item, 'Garment_Type', ''),
      Occasion: safeGet(item, 'Occasions', ''),
      FE_Item_Code: safeGet(item, 'FE_Item_Code', '')
    }));
    
    console.log(`Retrieved ${processedData.length} garment records for filtering`);
    return processedData;
  } catch (error) {
    console.error('Error in getGarments service:', error);
    throw error;
  }
};

module.exports = {
  processExcelFile,
  getUploadHistory,
  getDashboardStats,
  getBrands,
  getGarmentTypes,
  getRetailers,
  getItemCodes,
  getOccasions,
  getGarments
};
