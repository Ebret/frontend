const Collateral = require('../models/Collateral');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

/**
 * Collateral Controller
 * 
 * Handles all collateral-related operations
 */

// Get all collaterals with filtering, sorting, and pagination
exports.getCollaterals = async (req, res) => {
  try {
    const {
      search,
      type,
      status,
      minValue,
      maxValue,
      sortBy,
      sortOrder,
      page,
      limit
    } = req.query;
    
    // Convert query parameters to appropriate types
    const query = {
      search,
      type,
      status,
      minValue: minValue ? parseFloat(minValue) : undefined,
      maxValue: maxValue ? parseFloat(maxValue) : undefined,
      sortBy: sortBy || 'created_at',
      sortOrder: sortOrder === 'asc' ? 1 : -1,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10
    };
    
    const result = await Collateral.searchCollaterals(query);
    
    res.status(200).json({
      success: true,
      data: result.collaterals,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching collaterals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collaterals',
      error: error.message
    });
  }
};

// Get a single collateral by ID
exports.getCollateralById = async (req, res) => {
  try {
    const collateral = await Collateral.findById(req.params.id)
      .populate('owner', 'first_name last_name member_id')
      .populate('created_by', 'first_name last_name')
      .populate('updated_by', 'first_name last_name')
      .populate('verification.verified_by', 'first_name last_name')
      .populate('history.user', 'first_name last_name');
    
    if (!collateral) {
      return res.status(404).json({
        success: false,
        message: 'Collateral not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: collateral
    });
  } catch (error) {
    console.error('Error fetching collateral:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collateral',
      error: error.message
    });
  }
};

// Create a new collateral
exports.createCollateral = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Create new collateral
    const collateralData = {
      ...req.body,
      created_by: req.user.id
    };
    
    const collateral = new Collateral(collateralData);
    
    // Add history entry
    collateral.addHistoryEntry('created', req.user.id, null, 'Initial creation');
    
    await collateral.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json({
      success: true,
      message: 'Collateral created successfully',
      data: collateral
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error creating collateral:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create collateral',
      error: error.message
    });
  }
};

// Update an existing collateral
exports.updateCollateral = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Find the collateral
    const collateral = await Collateral.findById(req.params.id);
    
    if (!collateral) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Collateral not found'
      });
    }
    
    // Store original values for history
    const originalValues = { ...collateral.toObject() };
    delete originalValues.__v;
    delete originalValues.history;
    
    // Update fields
    const updateData = { ...req.body, updated_by: req.user.id };
    
    // Update the collateral
    const updatedCollateral = await Collateral.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true, session }
    );
    
    // Calculate changes for history
    const changes = {};
    for (const key in updateData) {
      if (JSON.stringify(originalValues[key]) !== JSON.stringify(updateData[key])) {
        changes[key] = {
          from: originalValues[key],
          to: updateData[key]
        };
      }
    }
    
    // Add history entry if there were changes
    if (Object.keys(changes).length > 0) {
      updatedCollateral.addHistoryEntry('updated', req.user.id, changes, req.body.notes || 'Updated collateral details');
      await updatedCollateral.save({ session });
    }
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({
      success: true,
      message: 'Collateral updated successfully',
      data: updatedCollateral
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error updating collateral:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update collateral',
      error: error.message
    });
  }
};

// Soft delete a collateral
exports.deleteCollateral = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Find the collateral
    const collateral = await Collateral.findById(req.params.id);
    
    if (!collateral) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Collateral not found'
      });
    }
    
    // Soft delete by setting is_deleted flag
    collateral.is_deleted = true;
    collateral.status = 'archived';
    collateral.updated_by = req.user.id;
    
    // Add history entry
    collateral.addHistoryEntry('deleted', req.user.id, null, req.body.notes || 'Collateral deleted');
    
    await collateral.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({
      success: true,
      message: 'Collateral deleted successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error deleting collateral:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete collateral',
      error: error.message
    });
  }
};

// Restore a deleted collateral
exports.restoreCollateral = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Find the collateral
    const collateral = await Collateral.findById(req.params.id);
    
    if (!collateral) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Collateral not found'
      });
    }
    
    // Restore by unsetting is_deleted flag
    collateral.is_deleted = false;
    collateral.status = 'active';
    collateral.updated_by = req.user.id;
    
    // Add history entry
    collateral.addHistoryEntry('restored', req.user.id, null, req.body.notes || 'Collateral restored');
    
    await collateral.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({
      success: true,
      message: 'Collateral restored successfully',
      data: collateral
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error restoring collateral:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore collateral',
      error: error.message
    });
  }
};

// Verify a collateral
exports.verifyCollateral = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Find the collateral
    const collateral = await Collateral.findById(req.params.id);
    
    if (!collateral) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Collateral not found'
      });
    }
    
    // Update verification details
    collateral.verification = {
      verified_by: req.user.id,
      verified_at: Date.now(),
      verification_notes: req.body.verification_notes || '',
      appraised_value: req.body.appraised_value || collateral.estimated_value
    };
    
    // Update status
    collateral.status = 'active';
    collateral.updated_by = req.user.id;
    
    // Add history entry
    collateral.addHistoryEntry('verified', req.user.id, {
      status: { from: collateral.status, to: 'active' },
      appraised_value: { from: null, to: req.body.appraised_value }
    }, req.body.verification_notes || 'Collateral verified');
    
    await collateral.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({
      success: true,
      message: 'Collateral verified successfully',
      data: collateral
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error verifying collateral:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify collateral',
      error: error.message
    });
  }
};

// Export collaterals to CSV
exports.exportCollaterals = async (req, res) => {
  try {
    // Get query parameters for filtering
    const {
      search,
      type,
      status,
      minValue,
      maxValue
    } = req.query;
    
    // Convert query parameters to appropriate types
    const query = {
      search,
      type,
      status,
      minValue: minValue ? parseFloat(minValue) : undefined,
      maxValue: maxValue ? parseFloat(maxValue) : undefined,
      limit: 1000 // Set a reasonable limit for export
    };
    
    // Get collaterals
    const result = await Collateral.searchCollaterals(query);
    const collaterals = result.collaterals;
    
    // Define CSV file path
    const timestamp = Date.now();
    const fileName = `collaterals_export_${timestamp}.csv`;
    const filePath = path.join(__dirname, '..', 'public', 'exports', fileName);
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Define CSV writer
    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'type', title: 'Type' },
        { id: 'estimated_value', title: 'Estimated Value' },
        { id: 'status', title: 'Status' },
        { id: 'owner', title: 'Owner' },
        { id: 'location', title: 'Location' },
        { id: 'registration_number', title: 'Registration Number' },
        { id: 'acquisition_date', title: 'Acquisition Date' },
        { id: 'created_at', title: 'Created At' },
        { id: 'created_by', title: 'Created By' }
      ]
    });
    
    // Format data for CSV
    const records = collaterals.map(collateral => ({
      id: collateral._id.toString(),
      name: collateral.name,
      type: collateral.type,
      estimated_value: collateral.estimated_value,
      status: collateral.status,
      owner: collateral.owner ? `${collateral.owner.first_name} ${collateral.owner.last_name}` : '',
      location: collateral.location || '',
      registration_number: collateral.registration_number || '',
      acquisition_date: collateral.acquisition_date ? new Date(collateral.acquisition_date).toISOString().split('T')[0] : '',
      created_at: new Date(collateral.created_at).toISOString(),
      created_by: collateral.created_by ? `${collateral.created_by.first_name} ${collateral.created_by.last_name}` : ''
    }));
    
    // Write CSV file
    await csvWriter.writeRecords(records);
    
    // Send file to client
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to download file',
          error: err.message
        });
      }
      
      // Delete file after sending
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting file:', unlinkErr);
        }
      });
    });
  } catch (error) {
    console.error('Error exporting collaterals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export collaterals',
      error: error.message
    });
  }
};
