const mongoose = require('mongoose');

/**
 * PriceSnapshot Schema
 * 
 * Purpose: 
 * Stores the specific real-time or historical pricing and details for a selected travel route 
 * at a given moment in time. It temporarily labels the AI recommendation as 'PENDING' until 
 * the prediction service assigns or updates it. It references the parent `Route` model.
 */
const priceSnapshotSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: [true, 'Route reference ID is required']
  },
  operatorName: {
    type: String,
    required: [true, 'Operator name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    trim: true
  },
  departureTime: {
    type: String,
    trim: true
  },
  arrivalTime: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  availableSeats: {
    type: Number,
    min: [0, 'Available seats cannot be negative']
  },
  aiRecommendation: {
    type: String,
    enum: {
      values: ['BUY_NOW', 'WAIT', 'PENDING'],
      message: '{VALUE} is not a valid AI recommendation status'
    },
    default: 'PENDING'
  },
  aiConfidence: {
    type: Number,
    min: [0, 'Confidence must be at least 0'],
    max: [1, 'Confidence cannot exceed 1'],
    default: null
  },
  fetchedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PriceSnapshot', priceSnapshotSchema);
