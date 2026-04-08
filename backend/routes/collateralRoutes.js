const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const collateralController = require('../controllers/collateralController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const upload = require('../middleware/fileUpload');

/**
 * Collateral Routes
 * 
 * All routes are protected and require authentication
 * Management role is required for all operations
 */

// Get all collaterals with filtering, sorting, and pagination
router.get(
  '/',
  auth,
  checkRole(['admin', 'manager', 'loan_officer']),
  collateralController.getCollaterals
);

// Get a single collateral by ID
router.get(
  '/:id',
  auth,
  checkRole(['admin', 'manager', 'loan_officer']),
  collateralController.getCollateralById
);

// Create a new collateral
router.post(
  '/',
  auth,
  checkRole(['admin', 'manager']),
  [
    check('name', 'Name is required').not().isEmpty(),
    check('type', 'Type is required').isIn([
      'real_estate', 'vehicle', 'equipment', 'inventory', 'cash', 'investment', 'other'
    ]),
    check('estimated_value', 'Estimated value is required and must be a positive number')
      .isNumeric()
      .custom(value => value > 0),
    check('owner', 'Owner ID is required').not().isEmpty()
  ],
  collateralController.createCollateral
);

// Update an existing collateral
router.put(
  '/:id',
  auth,
  checkRole(['admin', 'manager']),
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('type', 'Type must be valid').optional().isIn([
      'real_estate', 'vehicle', 'equipment', 'inventory', 'cash', 'investment', 'other'
    ]),
    check('estimated_value', 'Estimated value must be a positive number')
      .optional()
      .isNumeric()
      .custom(value => value > 0),
    check('status', 'Status must be valid').optional().isIn([
      'active', 'inactive', 'pending_verification', 'rejected', 'archived'
    ])
  ],
  collateralController.updateCollateral
);

// Soft delete a collateral
router.delete(
  '/:id',
  auth,
  checkRole(['admin', 'manager']),
  collateralController.deleteCollateral
);

// Restore a deleted collateral
router.post(
  '/:id/restore',
  auth,
  checkRole(['admin', 'manager']),
  collateralController.restoreCollateral
);

// Verify a collateral
router.post(
  '/:id/verify',
  auth,
  checkRole(['admin', 'manager']),
  [
    check('appraised_value', 'Appraised value must be a positive number')
      .optional()
      .isNumeric()
      .custom(value => value > 0)
  ],
  collateralController.verifyCollateral
);

// Upload document for a collateral
router.post(
  '/:id/documents',
  auth,
  checkRole(['admin', 'manager']),
  upload.single('document'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }
      
      const collateral = await Collateral.findById(req.params.id);
      
      if (!collateral) {
        return res.status(404).json({
          success: false,
          message: 'Collateral not found'
        });
      }
      
      // Add document to collateral
      collateral.documents.push({
        name: req.file.originalname,
        file_path: req.file.path,
        file_type: req.file.mimetype,
        size: req.file.size
      });
      
      // Add history entry
      collateral.addHistoryEntry(
        'updated',
        req.user.id,
        { documents: 'Document uploaded' },
        `Document uploaded: ${req.file.originalname}`
      );
      
      await collateral.save();
      
      res.status(200).json({
        success: true,
        message: 'Document uploaded successfully',
        data: {
          document: collateral.documents[collateral.documents.length - 1]
        }
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload document',
        error: error.message
      });
    }
  }
);

// Delete a document
router.delete(
  '/:id/documents/:documentId',
  auth,
  checkRole(['admin', 'manager']),
  async (req, res) => {
    try {
      const collateral = await Collateral.findById(req.params.id);
      
      if (!collateral) {
        return res.status(404).json({
          success: false,
          message: 'Collateral not found'
        });
      }
      
      // Find document index
      const documentIndex = collateral.documents.findIndex(
        doc => doc._id.toString() === req.params.documentId
      );
      
      if (documentIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }
      
      // Get document info for history
      const documentName = collateral.documents[documentIndex].name;
      
      // Remove document file if it exists
      const filePath = collateral.documents[documentIndex].file_path;
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      // Remove document from array
      collateral.documents.splice(documentIndex, 1);
      
      // Add history entry
      collateral.addHistoryEntry(
        'updated',
        req.user.id,
        { documents: 'Document removed' },
        `Document removed: ${documentName}`
      );
      
      await collateral.save();
      
      res.status(200).json({
        success: true,
        message: 'Document deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete document',
        error: error.message
      });
    }
  }
);

// Export collaterals to CSV
router.get(
  '/export/csv',
  auth,
  checkRole(['admin', 'manager']),
  collateralController.exportCollaterals
);

module.exports = router;
