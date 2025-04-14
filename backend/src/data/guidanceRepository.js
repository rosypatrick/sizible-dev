/**
 * Guidance Repository
 * 
 * This module provides data access methods for retailer guidance operations.
 * It interacts with the Supabase database to perform CRUD operations on the retailer_guidance table.
 */

const supabase = require('../utils/supabase');

/**
 * Repository for retailer guidance database operations
 */
const guidanceRepository = {
  /**
   * Get guidance by ID
   * 
   * @param {string} id - The guidance UUID
   * @returns {Promise<Object>} The guidance data
   * @throws {Error} If the database operation fails
   */
  async getById(id) {
    const { data, error } = await supabase
      .from('retailer_guidance')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Get guidance by retailer ID
   * 
   * @param {string} retailerId - The retailer's UUID
   * @param {Object} options - Query options
   * @param {number} options.limit - Maximum number of records to return
   * @param {number} options.offset - Number of records to skip
   * @param {string} options.guidanceType - Type of guidance to filter by
   * @returns {Promise<Array>} Array of guidance objects
   * @throws {Error} If the database operation fails
   */
  async getByRetailerId(retailerId, options = {}) {
    const { limit = 20, offset = 0, guidanceType } = options;
    
    let query = supabase
      .from('retailer_guidance')
      .select('*')
      .eq('retailer_id', retailerId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply guidance type filter if provided
    if (guidanceType) {
      query = query.eq('guidance_type', guidanceType);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Create new guidance
   * 
   * @param {Object} guidance - The guidance data to create
   * @param {string} guidance.retailer_id - The retailer's UUID
   * @param {string} guidance.guidance_text - The guidance text content
   * @param {string} guidance.guidance_type - The type of guidance (e.g., 'style', 'promotion')
   * @returns {Promise<Object>} The created guidance data
   * @throws {Error} If the database operation fails
   */
  async create(guidance) {
    const { data, error } = await supabase
      .from('retailer_guidance')
      .insert([guidance])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  /**
   * Update guidance
   * 
   * @param {string} id - The guidance UUID
   * @param {Object} updates - The fields to update
   * @returns {Promise<Object>} The updated guidance data
   * @throws {Error} If the database operation fails
   */
  async update(id, updates) {
    const { data, error } = await supabase
      .from('retailer_guidance')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  /**
   * Delete guidance
   * 
   * @param {string} id - The guidance UUID
   * @returns {Promise<void>}
   * @throws {Error} If the database operation fails
   */
  async delete(id) {
    const { error } = await supabase
      .from('retailer_guidance')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  
  /**
   * Get latest guidance for a retailer
   * 
   * @param {string} retailerId - The retailer's UUID
   * @param {string} guidanceType - Type of guidance to filter by
   * @returns {Promise<Object>} The latest guidance data
   * @throws {Error} If the database operation fails
   */
  async getLatestForRetailer(retailerId, guidanceType) {
    const { data, error } = await supabase
      .from('retailer_guidance')
      .select('*')
      .eq('retailer_id', retailerId)
      .eq('guidance_type', guidanceType)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    // PGRST116 is the "no rows returned" error code from PostgREST
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
};

module.exports = guidanceRepository;