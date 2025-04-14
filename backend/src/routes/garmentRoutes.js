/**
 * Garment Routes
 * 
 * Defines API routes for garment-related operations including CRUD and CSV import.
 */

const express = require('express');
const garmentController = require('../controllers/garmentController');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/garments
 * @desc    Get all garments with optional filtering
 * @access  Public
 */
router.get('/', garmentController.getAllGarments);

/**
 * @route   GET /api/garments/:feItemCode
 * @desc    Get a single garment by FE_item_Code
 * @access  Public
 */
router.get('/:feItemCode', garmentController.getGarmentByCode);

/**
 * @route   POST /api/garments
 * @desc    Create a new garment
 * @access  Private (Retailer staff only)
 */
router.post('/', authenticateJWT, garmentController.createGarment);

/**
 * @route   PUT /api/garments/:feItemCode
 * @desc    Update an existing garment
 * @access  Private (Retailer staff only)
 */
router.put('/:feItemCode', authenticateJWT, garmentController.updateGarment);

/**
 * @route   DELETE /api/garments/:feItemCode
 * @desc    Delete a garment
 * @access  Private (Retailer staff only)
 */
router.delete('/:feItemCode', authenticateJWT, garmentController.deleteGarment);

/**
 * @route   POST /api/garments/import
 * @desc    Import garments from CSV
 * @access  Private (Retailer staff only)
 */
router.post('/import', authenticateJWT, garmentController.importGarmentsFromCSV);

module.exports = router;
