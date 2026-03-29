const mongoose = require('mongoose');

/**
 * Prediction Schema
 * 
 * Purpose:
 * Records the results dispatched from the AI Service for a specific price snapshot.
 * Stores the final recommendation provided to the user, the model's confidence level, 
 * and the specific model version used during the inference. Represents the model's history.
 */
const predictionSchema = new mongoose.Schema({
  snapshotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PriceSnapshot',
    required: [true, 'Price snapshot reference ID is required']
  },
  recommendation: {
    type: String,
    enum: {
      values: ['BUY_NOW', 'WAIT'],
      message: '{VALUE} is not a valid recommendation outcome'
    },
    required: [true, 'Recommendation outcome is required']
  },
  confidence: {
    type: Number,
    min: [0, 'Confidence must be at least 0'],
    max: [1, 'Confidence cannot exceed 1'],
    required: [true, 'Confidence score is required']
  },
  modelVersion: {
    type: String,
    default: '1.0.0',
    trim: true
  },
  predictedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prediction', predictionSchema);
