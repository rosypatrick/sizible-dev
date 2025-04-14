/**
 * Garment Controller
 * 
 * Handles HTTP requests related to garments, including CRUD operations
 * and CSV import functionality.
 */

const garmentService = require('../services/garmentService');

/**
 * Get all garments with optional filtering
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllGarments = async (req, res) => {
  try {
    const options = {
      limit: req.query.limit ? parseInt(req.query.limit, 10) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset, 10) : undefined,
      brandId: req.query.brandId,
      garmentTypeId: req.query.garmentTypeId
    };
    
    const garments = await garmentService.getAllGarments(options);
    res.json(garments);
  } catch (error) {
    console.error('Error in getAllGarments controller:', error);
    res.status(500).json({ message: 'Failed to fetch garments', error: error.message });
  }
};

/**
 * Get a single garment by FE_item_Code
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getGarmentByCode = async (req, res) => {
  try {
    const { feItemCode } = req.params;
    const garment = await garmentService.getGarmentByCode(feItemCode);
    
    if (!garment) {
      return res.status(404).json({ message: 'Garment not found' });
    }
    
    res.json(garment);
  } catch (error) {
    console.error('Error in getGarmentByCode controller:', error);
    res.status(500).json({ message: 'Failed to fetch garment', error: error.message });
  }
};

/**
 * Create a new garment
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createGarment = async (req, res) => {
  try {
    const garmentData = req.body;
    const garment = await garmentService.createGarment(garmentData);
    res.status(201).json(garment);
  } catch (error) {
    console.error('Error in createGarment controller:', error);
    res.status(500).json({ message: 'Failed to create garment', error: error.message });
  }
};

/**
 * Update an existing garment
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateGarment = async (req, res) => {
  try {
    const { feItemCode } = req.params;
    const garmentData = req.body;
    const garment = await garmentService.updateGarment(feItemCode, garmentData);
    
    if (!garment) {
      return res.status(404).json({ message: 'Garment not found' });
    }
    
    res.json(garment);
  } catch (error) {
    console.error('Error in updateGarment controller:', error);
    res.status(500).json({ message: 'Failed to update garment', error: error.message });
  }
};

/**
 * Delete a garment
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteGarment = async (req, res) => {
  try {
    const { feItemCode } = req.params;
    await garmentService.deleteGarment(feItemCode);
    res.status(204).end();
  } catch (error) {
    console.error('Error in deleteGarment controller:', error);
    res.status(500).json({ message: 'Failed to delete garment', error: error.message });
  }
};

/**
 * Import garments from CSV
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const importGarmentsFromCSV = async (req, res) => {
  try {
    const { retailerId, brandId, csvData } = req.body;
    const userId = req.user.id; // Assuming authentication middleware sets req.user
    
    if (!retailerId || !brandId || !csvData) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        errors: ['retailerId, brandId, and csvData are required'] 
      });
    }
    
    const result = await garmentService.importGarmentsFromCSV(
      retailerId,
      brandId,
      csvData,
      userId
    );
    
    res.status(200).json({
      message: 'CSV import completed',
      import_id: result,
      record_count: result.record_count || 0,
      success_count: result.success_count || 0,
      error_count: result.error_count || 0
    });
  } catch (error) {
    console.error('Error in importGarmentsFromCSV controller:', error);
    res.status(500).json({ 
      message: 'Failed to import CSV data', 
      error: error.message,
      errors: [error.message]
    });
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
