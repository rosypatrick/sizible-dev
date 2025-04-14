/**
 * Retailer Repository
 * 
 * This module provides data access methods for retailer-related operations.
 * It interacts with the Supabase database to perform CRUD operations on the retailers table.
 */

const supabase = require('../utils/supabase');

/**
 * Repository for retailer-related database operations
 */
const retailerRepository = {
  /**
   * Get a retailer by ID
   * 
   * @param {string} id - The retailer's UUID
   * @returns {Promise<Object>} The retailer data
   * @throws {Error} If the database operation fails
   */
  async getById(id) {
    const { data, error } = await supabase
      .from('retailers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Get a retailer by name
   * 
   * @param {string} retailerName - The retailer's business name
   * @param {string} personalName - The retailer's personal name
   * @returns {Promise<Object|null>} The retailer data or null if not found
   * @throws {Error} If the database operation fails
   */
  async getByName(retailerName, personalName) {
    const { data, error } = await supabase
      .from('retailers')
      .select('*')
      .eq('retailer_name', retailerName)
      .eq('personal_name', personalName)
      .single();
    
    // PGRST116 is the "no rows returned" error code from PostgREST
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
  
  /**
   * Create a new retailer
   * 
   * @param {Object} retailer - The retailer data to create
   * @param {string} retailer.retailer_name - The retailer's business name
   * @param {string} retailer.personal_name - The retailer's personal name
   * @returns {Promise<Object>} The created retailer data
   * @throws {Error} If the database operation fails
   */
  async create(retailer) {
    const { data, error } = await supabase
      .from('retailers')
      .insert([retailer])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  /**
   * Update a retailer
   * 
   * @param {string} id - The retailer's UUID
   * @param {Object} updates - The fields to update
   * @returns {Promise<Object>} The updated retailer data
   * @throws {Error} If the database operation fails
   */
  async update(id, updates) {
    const { data, error } = await supabase
      .from('retailers')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  /**
   * Get all retailers
   * 
   * @returns {Promise<Array>} Array of retailer objects
   * @throws {Error} If the database operation fails
   */
  async getAll() {
    const { data, error } = await supabase
      .from('retailers')
      .select('*')
      .order('retailer_name', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};

module.exports = retailerRepository;