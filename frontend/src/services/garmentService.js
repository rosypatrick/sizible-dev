/**
 * Garment Service
 * 
 * This service provides functions to interact with the garments data in Supabase.
 * It handles fetching, creating, updating, and deleting garment records.
 */

import supabase from '../utils/supabaseClient';

/**
 * Fetch all garments
 * 
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of records to return
 * @param {number} options.offset - Number of records to skip
 * @param {string} options.brandId - Filter by brand ID
 * @param {string} options.garmentType - Filter by garment type
 * @returns {Promise<Array>} Array of garment objects
 */
export const getAllGarments = async (options = {}) => {
  try {
    let query = supabase
      .from('garments')
      .select('*, brands(name), garment_types(name)');
    
    // Apply filters if provided
    if (options.brandId) {
      query = query.eq('brand_id', options.brandId);
    }
    
    if (options.garmentType) {
      query = query.eq('garment_type_id', options.garmentType);
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
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Garment service error:', error);
    throw error;
  }
};

/**
 * Fetch a single garment by FE_item_Code
 * 
 * @param {string} feItemCode - The FE_item_Code to look up
 * @returns {Promise<Object>} Garment object
 */
export const getGarmentByCode = async (feItemCode) => {
  try {
    const { data, error } = await supabase
      .from('garments')
      .select('*, brands(name), garment_types(name)')
      .eq('fe_item_code', feItemCode)
      .single();
    
    if (error) {
      console.error('Error fetching garment:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Garment service error:', error);
    throw error;
  }
};

/**
 * Get size recommendations for a garment
 * 
 * @param {string} feItemCode - The FE_item_Code to look up
 * @param {string} consumerId - The consumer ID to get recommendations for
 * @returns {Promise<Object>} Size recommendation object
 */
export const getSizeRecommendation = async (feItemCode, consumerId) => {
  try {
    const { data, error } = await supabase
      .from('api_size_recommendations')
      .select('*')
      .eq('fe_item_code', feItemCode)
      .eq('consumer_id', consumerId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching size recommendation:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Size recommendation service error:', error);
    throw error;
  }
};

/**
 * Get all brands
 * 
 * @returns {Promise<Array>} Array of brand objects
 */
export const getAllBrands = async () => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*');
    
    if (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Brand service error:', error);
    throw error;
  }
};

/**
 * Get all garment types
 * 
 * @returns {Promise<Array>} Array of garment type objects
 */
export const getAllGarmentTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('garment_types')
      .select('*');
    
    if (error) {
      console.error('Error fetching garment types:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Garment type service error:', error);
    throw error;
  }
};
