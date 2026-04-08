const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Collateral Schema
 * 
 * Represents collateral items that can be used to secure loans
 */
const CollateralSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Collateral name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Collateral type is required'],
    enum: ['real_estate', 'vehicle', 'equipment', 'inventory', 'cash', 'investment', 'other'],
    default: 'other'
  },
  estimated_value: {
    type: Number,
    required: [true, 'Estimated value is required'],
    min: [0, 'Value cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending_verification', 'rejected', 'archived'],
    default: 'pending_verification'
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Member',
    required: [true, 'Collateral owner is required']
  },
  location: {
    type: String,
    trim: true
  },
  registration_number: {
    type: String,
    trim: true
  },
  acquisition_date: {
    type: Date
  },
  documents: [{
    name: String,
    file_path: String,
    upload_date: {
      type: Date,
      default: Date.now
    },
    file_type: String,
    size: Number
  }],
  verification: {
    verified_by: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    verified_at: Date,
    verification_notes: String,
    appraised_value: Number
  },
  metadata: {
    // For real estate
    property_type: {
      type: String,
      enum: ['residential', 'commercial', 'agricultural', 'industrial', 'vacant_land']
    },
    property_size: Number, // in square meters
    property_address: String,
    
    // For vehicles
    make: String,
    model: String,
    year: Number,
    plate_number: String,
    
    // For equipment
    manufacturer: String,
    model_number: String,
    serial_number: String,
    
    // For investments
    investment_type: String,
    institution: String,
    account_number: String,
    maturity_date: Date
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updated_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  history: [{
    action: {
      type: String,
      enum: ['created', 'updated', 'verified', 'rejected', 'archived', 'deleted', 'restored'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    changes: Schema.Types.Mixed,
    notes: String
  }]
});

// Pre-save middleware to update the 'updated_at' field
CollateralSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Pre-update middleware to update the 'updated_at' field
CollateralSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updated_at: Date.now() });
  next();
});

// Add text index for search functionality
CollateralSchema.index({ 
  name: 'text', 
  description: 'text', 
  registration_number: 'text',
  'metadata.property_address': 'text',
  'metadata.make': 'text',
  'metadata.model': 'text'
});

// Virtual for formatted currency
CollateralSchema.virtual('formatted_value').get(function() {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(this.estimated_value);
});

// Virtual for formatted date
CollateralSchema.virtual('formatted_acquisition_date').get(function() {
  if (!this.acquisition_date) return '';
  return new Intl.DateTimeFormat('en-PH').format(this.acquisition_date);
});

// Method to add history entry
CollateralSchema.methods.addHistoryEntry = function(action, user, changes = null, notes = '') {
  this.history.push({
    action,
    user,
    changes,
    notes,
    timestamp: Date.now()
  });
};

// Static method to search collaterals
CollateralSchema.statics.searchCollaterals = async function(query = {}, options = {}) {
  const {
    search,
    type,
    status,
    minValue,
    maxValue,
    sortBy = 'created_at',
    sortOrder = -1,
    page = 1,
    limit = 10
  } = query;
  
  const filter = { is_deleted: false };
  
  // Add search text if provided
  if (search) {
    filter.$text = { $search: search };
  }
  
  // Add type filter if provided
  if (type) {
    filter.type = type;
  }
  
  // Add status filter if provided
  if (status) {
    filter.status = status;
  }
  
  // Add value range filter if provided
  if (minValue !== undefined || maxValue !== undefined) {
    filter.estimated_value = {};
    if (minValue !== undefined) {
      filter.estimated_value.$gte = minValue;
    }
    if (maxValue !== undefined) {
      filter.estimated_value.$lte = maxValue;
    }
  }
  
  // Calculate pagination
  const skip = (page - 1) * limit;
  
  // Create sort object
  const sort = {};
  sort[sortBy] = sortOrder;
  
  // Execute query with pagination
  const collaterals = await this.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('owner', 'first_name last_name member_id')
    .populate('created_by', 'first_name last_name')
    .populate('verification.verified_by', 'first_name last_name');
  
  // Get total count for pagination
  const totalCount = await this.countDocuments(filter);
  
  return {
    collaterals,
    pagination: {
      total: totalCount,
      page,
      limit,
      pages: Math.ceil(totalCount / limit)
    }
  };
};

const Collateral = mongoose.model('Collateral', CollateralSchema);

module.exports = Collateral;
