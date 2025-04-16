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

module.exports = router;
