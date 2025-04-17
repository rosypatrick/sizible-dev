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
            "Retailer": row.Retailer || null,
            "Occasion": row.Occasion || null,
            "updated_at": new Date().toISOString(),
            "upload_id": logId || null
          };
          
          let result;
          
          if (existingData) {
            // Update existing garment
            result = await supabase
              .from('garments_excel')
              .update(garmentData)
              .eq('id', existingData.id);
              
            if (result.error) {
              console.error(`Error updating garment: ${result.error.message}`);
              errorCount++;
            } else {
              updateCount++;
              successCount++;
            }
          } else {
            // Insert new garment
            result = await supabase
              .from('garments_excel')
              .insert(garmentData);
              
            if (result.error) {
              console.error(`Error inserting garment: ${result.error.message}`);
              errorCount++;
            } else {
              insertCount++;
              successCount++;
            }
          }
        } catch (rowError) {
          console.error(`Error processing row: ${rowError.message}`);
          errorCount++;
        }
      }
      
      // Update the upload log with the results
      if (logId) {
        const { error: updateError } = await supabase
          .from('upload_logs')
          .update({
            status: 'completed',
            records_processed: data.length,
            records_succeeded: successCount,
            records_failed: errorCount,
            completed_at: new Date().toISOString()
          })
          .eq('id', logId);
          
        if (updateError) {
          console.error(`Error updating upload log: ${updateError.message}`);
        }
      }
      
      console.log(`Excel processing completed. Success: ${successCount}, Errors: ${errorCount}, Inserts: ${insertCount}, Updates: ${updateCount}`);
      
      return {
        success: successCount,
        errors: errorCount,
        inserts: insertCount,
        updates: updateCount,
        total: data.length
      };
      
    } catch (parseError) {
      console.error('Error parsing Excel file:', parseError);
      throw new Error(`Failed to parse Excel file: ${parseError.message}`);
    }
  } catch (error) {
    console.error('Excel processing error:', error);
    throw error;
  }
};

/**
 * Get dashboard statistics
 * 
 * @returns {Promise<Object>} Dashboard statistics
 */
const getDashboardStats = async () => {
  try {
    console.log('Fetching dashboard statistics from database');
    
    // Get total products count - using length of returned array instead of count
    const { data: productsData, error: productsError } = await supabase
      .from('garments_excel')
      .select('id');
    
    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw new Error(`Database error: ${productsError.message}`);
    }
    
    const productsCount = productsData ? productsData.length : 0;
    
    // Get unique retailers count
    const { data: retailersData, error: retailersError } = await supabase
      .from('garments_excel')
      .select('Retailer')
      .not('Retailer', 'is', null);
    
    if (retailersError) {
      console.error('Error fetching retailers:', retailersError);
      throw new Error(`Database error: ${retailersError.message}`);
    }
    
    // Count unique retailers
    const uniqueRetailers = new Set(retailersData.map(item => item.Retailer)).size;
    
    // Get unique brands count
    const { data: brandsData, error: brandsError } = await supabase
      .from('garments_excel')
      .select('Brand')
      .not('Brand', 'is', null);
    
    if (brandsError) {
      console.error('Error fetching brands:', brandsError);
      throw new Error(`Database error: ${brandsError.message}`);
    }
    
    // Count unique brands
    const uniqueBrands = new Set(brandsData.map(item => item.Brand)).size;
    
    // Get uploads count - using length of returned array instead of count
    const { data: uploadsData, error: uploadsError } = await supabase
      .from('upload_logs')
      .select('id');
    
    if (uploadsError) {
      console.error('Error fetching uploads:', uploadsError);
      // If the error is because the table doesn't exist, return 0
      if (uploadsError.message && uploadsError.message.includes('relation "upload_logs" does not exist')) {
        console.log('upload_logs table does not exist, returning 0');
        return {
          products: productsCount || 0,
          retailers: uniqueRetailers || 0,
          brands: uniqueBrands || 0,
          uploads: 0
        };
      }
      throw new Error(`Database error: ${uploadsError.message}`);
    }
    
    const uploadsCount = uploadsData ? uploadsData.length : 0;
    
    return {
      products: productsCount || 0,
      retailers: uniqueRetailers || 0,
      brands: uniqueBrands || 0,
      uploads: uploadsCount || 0
    };
  } catch (error) {
    console.error('Get dashboard stats service error:', error);
    // Return default values in case of error
    return {
      products: 0,
      retailers: 0,
      brands: 0,
      uploads: 0
    };
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
      // If the error is because the table doesn't exist, return empty array
      if (error.message && error.message.includes('relation "upload_logs" does not exist')) {
        console.log('upload_logs table does not exist, returning empty array');
        return [];
      }
      throw new Error(`Database error: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Get upload history service error:', error);
    // Return empty array instead of throwing error
    return [];
  }
};

/**
 * Get unique brands from the database
 * 
 * @returns {Promise<Array>} Unique brands
 */
const getBrands = async () => {
  try {
    console.log('Fetching unique brands from database');
    
    // Get all brands from garments_excel table
    const { data: brandsData, error: brandsError } = await supabase
      .from('garments_excel')
      .select('Brand')
      .not('Brand', 'is', null);
    
    if (brandsError) {
      console.error('Error fetching brands:', brandsError);
      throw new Error(`Database error: ${brandsError.message}`);
    }
    
    // Extract unique brands and sort them
    const uniqueBrands = [...new Set(brandsData.map(item => item.Brand))]
      .filter(Boolean)
      .sort();
    
    return uniqueBrands.map(brand => ({
      id: brand,
      name: brand
    }));
  } catch (error) {
    console.error('Get brands service error:', error);
    return [];
  }
};

/**
 * Get unique garment types from the database
 * 
 * @returns {Promise<Array>} Unique garment types
 */
const getGarmentTypes = async () => {
  try {
    console.log('Fetching unique garment types from database');
    
    // Get all garment types from garments_excel table
    const { data: garmentTypesData, error: garmentTypesError } = await supabase
      .from('garments_excel')
      .select('Garment_Type, Garment_Type_text')
      .not('Garment_Type', 'is', null);
    
    if (garmentTypesError) {
      console.error('Error fetching garment types:', garmentTypesError);
      throw new Error(`Database error: ${garmentTypesError.message}`);
    }
    
    // Create a map to track unique display names
    const uniqueDisplayNames = new Map();
    
    // Process each item, normalizing and deduplicating
    garmentTypesData
      .filter(item => item.Garment_Type) // Filter out null/undefined values
      .forEach(item => {
        // Use the display name (text) or fall back to the type code
        const displayName = (item.Garment_Type_text || item.Garment_Type).trim();
        // Create a normalized key for comparison (lowercase)
        const normalizedName = displayName.toLowerCase();
        
        // Only add if we haven't seen this display name yet
        if (!uniqueDisplayNames.has(normalizedName)) {
          uniqueDisplayNames.set(normalizedName, {
            id: item.Garment_Type,
            name: displayName
          });
        }
      });
    
    // Convert to array and sort alphabetically
    const uniqueTypes = Array.from(uniqueDisplayNames.values())
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    
    console.log(`Found ${uniqueTypes.length} unique garment types out of ${garmentTypesData.length} total`);
    
    // Log the unique types for debugging
    console.log('Unique garment types:', uniqueTypes.map(t => t.name).join(', '));
    
    return uniqueTypes;
  } catch (error) {
    console.error('Get garment types service error:', error);
    return [];
  }
};

/**
 * Get unique retailers from the database
 * 
 * @returns {Promise<Array>} Unique retailers
 */
const getRetailers = async () => {
  try {
    console.log('Fetching unique retailers from database');
    
    // Get all retailers from garments_excel table
    const { data: retailersData, error: retailersError } = await supabase
      .from('garments_excel')
      .select('Retailer')
      .not('Retailer', 'is', null);
    
    if (retailersError) {
      console.error('Error fetching retailers:', retailersError);
      throw new Error(`Database error: ${retailersError.message}`);
    }
    
    // Extract unique retailers and sort them
    const uniqueRetailers = [...new Set(retailersData.map(item => item.Retailer))]
      .filter(Boolean)
      .sort();
    
    return uniqueRetailers.map(retailer => ({
      id: retailer,
      name: retailer
    }));
  } catch (error) {
    console.error('Get retailers service error:', error);
    return [];
  }
};

/**
 * Get unique FE_Item_Codes from the database
 * 
 * @returns {Promise<Array>} Unique FE_Item_Codes
 */
const getItemCodes = async () => {
  try {
    console.log('Fetching unique FE_Item_Codes from database');
    
    // Get all FE_Item_Codes from garments_excel table
    const { data: itemCodesData, error: itemCodesError } = await supabase
      .from('garments_excel')
      .select('FE_Item_Code, Title')
      .not('FE_Item_Code', 'is', null);
    
    if (itemCodesError) {
      console.error('Error fetching FE_Item_Codes:', itemCodesError);
      throw new Error(`Database error: ${itemCodesError.message}`);
    }
    
    // Create a map to track unique item codes
    const uniqueItemCodes = new Map();
    
    // Process each item, normalizing and deduplicating
    itemCodesData
      .filter(item => item.FE_Item_Code) // Filter out null/undefined values
      .forEach(item => {
        // Create a normalized key for comparison
        const normalizedCode = item.FE_Item_Code.trim();
        
        // Use the title as display name if available, otherwise use the code
        const displayName = item.Title ? 
          `${normalizedCode} - ${item.Title}` : 
          normalizedCode;
        
        // Only add if we haven't seen this code yet
        if (!uniqueItemCodes.has(normalizedCode)) {
          uniqueItemCodes.set(normalizedCode, {
            id: normalizedCode,
            name: displayName
          });
        }
      });
    
    // Convert to array and sort
    const itemCodes = Array.from(uniqueItemCodes.values())
      .sort((a, b) => a.id.localeCompare(b.id));
    
    console.log(`Found ${itemCodes.length} unique FE_Item_Codes out of ${itemCodesData.length} total`);
    
    return itemCodes;
  } catch (error) {
    console.error('Get item codes service error:', error);
    return [];
  }
};

/**
 * Get unique occasions from the database
 * 
 * @returns {Promise<Array>} Unique occasions
 */
const getOccasions = async () => {
  try {
    console.log('Fetching unique occasions from database');
    
    // Get all occasions from garments_excel table
    // Note: Assuming occasions are stored in a field called "Occasion" or similar
    const { data: occasionsData, error: occasionsError } = await supabase
      .from('garments_excel')
      .select('Occasion')
      .not('Occasion', 'is', null);
    
    if (occasionsError) {
      console.error('Error fetching occasions:', occasionsError);
      throw new Error(`Database error: ${occasionsError.message}`);
    }
    
    // Create a map to track unique occasions
    const uniqueOccasions = new Map();
    
    // Process and deduplicate occasions
    // Some occasions might be comma-separated values, so we need to split them
    occasionsData.forEach(item => {
      if (item.Occasion) {
        // Split by comma if multiple occasions are present
        const occasions = item.Occasion.split(',').map(occ => occ.trim());
        
        occasions.forEach(occasion => {
          if (occasion) {
            const normalizedOccasion = occasion.trim().toLowerCase();
            const displayName = normalizedOccasion;
            
            // Only add if we haven't seen this occasion yet
            if (!uniqueOccasions.has(normalizedOccasion)) {
              uniqueOccasions.set(normalizedOccasion, {
                id: occasion,
                name: displayName
              });
            }
          }
        });
      }
    });
    
    // If no occasions found, provide some default values
    if (uniqueOccasions.size === 0) {
      const defaults = ['Casual', 'Formal', 'Business', 'Party', 'Wedding'];
      defaults.forEach(occasion => {
        uniqueOccasions.set(occasion.toLowerCase(), {
          id: occasion,
          name: occasion
        });
      });
    }
    
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
      .select('Retailer, Brand, Garment_Type, Occasion, FE_Item_Code');
    
    if (error) {
      console.error('Error fetching garment data:', error);
      throw new Error('Failed to fetch garment data');
    }
    
    // Process the data to ensure consistent format for filtering
    const processedData = garmentData.map(item => ({
      Retailer: item.Retailer,
      Brand: item.Brand,
      Garment_Type: item.Garment_Type,
      Occasion: item.Occasion,
      FE_Item_Code: item.FE_Item_Code
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
