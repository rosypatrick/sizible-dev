/**
 * Admin Routes
 * 
 * This module defines the routes for admin-specific operations.
 */

const express = require('express');
const multer = require('multer');
const adminController = require('../controllers/adminController');
// const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @route   POST /api/admin/upload-excel
 * @desc    Upload and process Excel file
 * @access  Admin only
 */
// In a production environment, this would use authentication middleware
// router.post('/upload-excel', authenticateJWT, upload.single('file'), adminController.uploadExcelFile);
router.post('/upload-excel', upload.single('file'), adminController.uploadExcelFile);

/**
 * @route   GET /api/admin/upload-history
 * @desc    Get upload history
 * @access  Admin only
 */
// In a production environment, this would use authentication middleware
// router.get('/upload-history', authenticateJWT, adminController.getUploadHistory);
router.get('/upload-history', adminController.getUploadHistory);

/**
 * @route   GET /api/admin/dashboard-stats
 * @desc    Get dashboard statistics
 * @access  Admin only
 */
// In a production environment, this would use authentication middleware
// router.get('/dashboard-stats', authenticateJWT, adminController.getDashboardStats);
router.get('/dashboard-stats', adminController.getDashboardStats);

/**
 * @route   GET /api/admin/brands
 * @desc    Get unique brands from the database
 * @access  Public
 */
router.get('/brands', adminController.getBrands);

/**
 * @route   GET /api/admin/garment-types
 * @desc    Get unique garment types from the database
 * @access  Public
 */
router.get('/garment-types', adminController.getGarmentTypes);

/**
 * @route   GET /api/admin/retailers
 * @desc    Get unique retailers from the database
 * @access  Public
 */
router.get('/retailers', adminController.getRetailers);

/**
 * @route   GET /api/admin/item-codes
 * @desc    Get unique FE_Item_Codes from the database
 * @access  Public
 */
router.get('/item-codes', adminController.getItemCodes);

/**
 * @route   GET /api/admin/occasions
 * @desc    Get unique occasions from the database
 * @access  Public
 */
router.get('/occasions', adminController.getOccasions);

/**
 * @route   GET /api/admin/garments
 * @desc    Get all garment data for filtering
 * @access  Public
 */
router.get('/garments', adminController.getGarments);

module.exports = router;
