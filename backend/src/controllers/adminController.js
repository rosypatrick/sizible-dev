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

module.exports = {
  uploadExcelFile,
  getUploadHistory
};
