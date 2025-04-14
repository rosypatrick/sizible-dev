/**
 * Garment Repository
 * 
 * This module provides data access methods for garment-related operations.
 * It interacts with the Supabase database to perform CRUD operations on the garments table.
 */

const supabase = require('../utils/supabase');

/**
 * Repository for garment-related database operations
 */
const garmentRepository = {
  /**
   * Get a garment by ID
   * 
   * @param {string} id - The garment's UUID
   * @returns {Promise<Object>} The garment data
   * @throws {Error} If the database operation fails
   */
  async getById(id) {
    const { data, error } = await supabase
      .from('garments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Get garments by retailer ID
   * 
   * @param {string} retailerId - The retailer's UUID
   * @param {Object} options - Query options
   * @param {number} options.limit - Maximum number of records to return
   * @param {number} options.offset - Number of records to skip
   * @param {Object} options.filters - Filter criteria
   * @returns {Promise<Array>} Array of garment objects
   * @throws {Error} If the database operation fails
   */
  async getByRetailerId(retailerId, options = {}) {
    const { limit = 20, offset = 0, filters = {} } = options;
    
    let query = supabase
      .from('garments')
      .select('*')
      .eq('retailer_id', retailerId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply additional filters if provided
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Create a new garment
   * 
   * @param {Object} garment - The garment data to create
   * @returns {Promise<Object>} The created garment data
   * @throws {Error} If the database operation fails
   */
  async create(garment) {
    const { data, error } = await supabase
      .from('garments')
      .insert([garment])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  /**
   * Update a garment
   * 
   * @param {string} id - The garment's UUID
   * @param {Object} updates - The fields to update
   * @returns {Promise<Object>} The updated garment data
   * @throws {Error} If the database operation fails
   */
  async update(id, updates) {
    const { data, error } = await supabase
      .from('garments')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  /**
   * Delete a garment
   * 
   * @param {string} id - The garment's UUID
   * @returns {Promise<void>}
   * @throws {Error} If the database operation fails
   */
  async delete(id) {
    const { error } = await supabase
      .from('garments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  
  /**
   * Get distinct brands for a retailer
   * 
   * @param {string} retailerId - The retailer's UUID
   * @returns {Promise<Array>} Array of distinct brand names
   * @throws {Error} If the database operation fails
   */
  async getBrandsByRetailerId(retailerId) {
    const { data, error } = await supabase
      .from('garments')
      .select('brand')
      .eq('retailer_id', retailerId)
      .order('brand')
      .distinctOn('brand');
    
    if (error) throw error;
    return data.map(item => item.brand);
  },
  
  /**
   * Get distinct garment types for a retailer and brand
   * 
   * @param {string} retailerId - The retailer's UUID
   * @param {string} brand - The brand name
   * @returns {Promise<Array>} Array of distinct garment types
   * @throws {Error} If the database operation fails
   */
  async getGarmentTypesByRetailerAndBrand(retailerId, brand) {
    const { data, error } = await supabase
      .from('garments')
      .select('garment_type')
      .eq('retailer_id', retailerId)
      .eq('brand', brand)
      .order('garment_type')
      .distinctOn('garment_type');
    
    if (error) throw error;
    return data.map(item => item.garment_type);
  }
};

module.exports = garmentRepository;