/**
 * Garment Service
 * 
 * This service provides functions to interact with the garments data in Supabase.
 * It handles database operations for garment-related functionality.
 */

const supabase = require('../utils/supabaseClient');

/**
 * Get all garments with optional filtering
 * 
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of records to return
 * @param {number} options.offset - Number of records to skip
 * @param {string} options.brandId - Filter by brand ID
 * @param {string} options.garmentTypeId - Filter by garment type ID
 * @returns {Promise<Array>} Array of garment objects
 */
const getAllGarments = async (options = {}) => {
  try {
    let query = supabase
      .from('garments_excel')
      .select('*');
    
    // Apply filters if provided
    if (options.brandId) {
      query = query.eq('Brand', options.brandId);
    }
    
    if (options.garmentTypeId) {
      query = query.eq('Garment_Type', options.garmentTypeId);
    }
    
    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching garments:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Garment service error:', error);
    throw error;
  }
};

/**
 * Get a single garment by FE_item_Code
 * 
 * @param {string} feItemCode - The FE_item_Code to look up
 * @returns {Promise<Object>} Garment object
 */
const getGarmentByCode = async (feItemCode) => {
  try {
    const { data, error } = await supabase
      .from('garments_excel')
      .select('*')
      .eq('FE_Item_Code', feItemCode)
      .single();
    
    if (error) {
      console.error('Error fetching garment:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Garment service error:', error);
    throw error;
  }
};

/**
 * Create a new garment
 * 
 * @param {Object} garmentData - The garment data to insert
 * @returns {Promise<Object>} The created garment
 */
const createGarment = async (garmentData) => {
  try {
    const { data, error } = await supabase
      .from('garments_excel')
      .insert(garmentData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating garment:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Garment service error:', error);
    throw error;
  }
};

/**
 * Update an existing garment
 * 
 * @param {string} feItemCode - The FE_Item_Code of the garment to update
 * @param {Object} garmentData - The updated garment data
 * @returns {Promise<Object>} The updated garment
 */
const updateGarment = async (feItemCode, garmentData) => {
  try {
    const { data, error } = await supabase
      .from('garments_excel')
      .update(garmentData)
      .eq('FE_Item_Code', feItemCode)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating garment:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Garment service error:', error);
    throw error;
  }
};

/**
 * Delete a garment
 * 
 * @param {string} feItemCode - The FE_Item_Code of the garment to delete
 * @returns {Promise<void>}
 */
const deleteGarment = async (feItemCode) => {
  try {
    const { error } = await supabase
      .from('garments_excel')
      .delete()
      .eq('FE_Item_Code', feItemCode);
    
    if (error) {
      console.error('Error deleting garment:', error);
      throw new Error(`Database error: ${error.message}`);
    }
  } catch (error) {
    console.error('Garment service error:', error);
    throw error;
  }
};

/**
 * Import garments from CSV data
 * 
 * @param {string} retailerId - The retailer ID
 * @param {string} brandId - The brand ID
 * @param {string} csvData - The CSV data as a string
 * @param {string} userId - The user ID performing the import
 * @returns {Promise<Object>} Import results
 */
const importGarmentsFromCSV = async (retailerId, brandId, csvData, userId) => {
  try {
    const { data, error } = await supabase.rpc(
      'import_garments_from_csv',
      {
        p_retailer_id: retailerId,
        p_brand_id: brandId,
        p_csv_data: csvData,
        p_imported_by: userId
      }
    );
    
    if (error) {
      console.error('Error importing garments from CSV:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('CSV import service error:', error);
    throw error;
  }
};

module.exports = {
  getAllGarments,
  getGarmentByCode,
  createGarment,
  updateGarment,
  deleteGarment,
  importGarmentsFromCSV
};
