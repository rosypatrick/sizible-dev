/**
 * Admin Controller
 * 
 * This controller handles admin-specific operations such as Excel file uploads.
 */

const adminService = require('../services/adminService');

/**
 * Upload and process Excel file
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with upload results
 */
const uploadExcelFile = async (req, res) => {
  try {
    console.log('Upload request received');
    
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    console.log(`Processing file: ${req.file.originalname}, size: ${req.file.size} bytes`);
    
    // Get file buffer from multer
    const fileBuffer = req.file.buffer;
    const filename = req.file.originalname;
    
    // Process the Excel file
    const result = await adminService.processExcelFile(fileBuffer, filename, req.user?.id);
    
    console.log('File processed successfully:', result);
    
    res.status(200).json({
      message: `File processed successfully. ${result.success} records updated.`,
      result
    });
  } catch (error) {
    console.error('Error in uploadExcelFile controller:', error);
    res.status(500).json({
      message: 'Error processing Excel file',
      error: error.message
    });
  }
};

/**
 * Get upload history
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with upload history
 */
const getUploadHistory = async (req, res) => {
  try {
    const history = await adminService.getUploadHistory();
    
    res.status(200).json({
      history
    });
  } catch (error) {
    console.error('Error in getUploadHistory controller:', error);
    res.status(500).json({
      message: 'Error retrieving upload history',
      error: error.message
    });
  }
};

/**
 * Get dashboard statistics
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with dashboard statistics
 */
const getDashboardStats = async (req, res) => {
  try {
    console.log('Dashboard stats request received');
    const stats = await adminService.getDashboardStats();
    console.log('Dashboard stats retrieved:', JSON.stringify(stats, null, 2));
    
    // Return the stats directly without wrapping them in a stats property
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error in getDashboardStats controller:', error);
    res.status(500).json({
      message: 'Error retrieving dashboard statistics',
      error: error.message
    });
  }
};

/**
 * Get unique brands from the database
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with unique brands
 */
const getBrands = async (req, res) => {
  try {
    const brands = await adminService.getBrands();
    
    res.status(200).json({
      brands
    });
  } catch (error) {
    console.error('Error in getBrands controller:', error);
    res.status(500).json({
      message: 'Error retrieving brands',
      error: error.message
    });
  }
};

/**
 * Get unique garment types from the database
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with unique garment types
 */
const getGarmentTypes = async (req, res) => {
  try {
    const garmentTypes = await adminService.getGarmentTypes();
    
    res.status(200).json({
      garmentTypes
    });
  } catch (error) {
    console.error('Error in getGarmentTypes controller:', error);
    res.status(500).json({
      message: 'Error retrieving garment types',
      error: error.message
    });
  }
};

/**
 * Get unique retailers from the database
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with unique retailers
 */
const getRetailers = async (req, res) => {
  try {
    const retailers = await adminService.getRetailers();
    
    res.status(200).json({
      retailers
    });
  } catch (error) {
    console.error('Error in getRetailers controller:', error);
    res.status(500).json({
      message: 'Error retrieving retailers',
      error: error.message
    });
  }
};

/**
 * Get unique FE_Item_Codes from the database
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with unique FE_Item_Codes
 */
const getItemCodes = async (req, res) => {
  try {
    const itemCodes = await adminService.getItemCodes();
    
    res.status(200).json({
      itemCodes
    });
  } catch (error) {
    console.error('Error in getItemCodes controller:', error);
    res.status(500).json({
      message: 'Error retrieving item codes',
      error: error.message
    });
  }
};

/**
 * Get unique occasions from the database
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with unique occasions
 */
const getOccasions = async (req, res) => {
  try {
    const occasions = await adminService.getOccasions();
    
    res.status(200).json({
      occasions
    });
  } catch (error) {
    console.error('Error in getOccasions controller:', error);
    res.status(500).json({
      message: 'Error retrieving occasions',
      error: error.message
    });
  }
};

/**
 * Get all garment data for filtering
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with garment data
 */
const getGarments = async (req, res) => {
  try {
    const garments = await adminService.getGarments();
    
    res.status(200).json({
      garments
    });
  } catch (error) {
    console.error('Error in getGarments controller:', error);
    res.status(500).json({
      message: 'Error retrieving garment data',
      error: error.message
    });
  }
};

module.exports = {
  uploadExcelFile,
  getUploadHistory,
  getDashboardStats,
  getBrands,
  getGarmentTypes,
  getRetailers,
  getItemCodes,
  getOccasions,
  getGarments
};
