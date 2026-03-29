const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  origin: {
    type: String,
    required: [true, 'Origin is required'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  travelDate: {
    type: Date,
    required: [true, 'Travel date is required']
  },
  transportType: {
    type: String,
    enum: {
      values: ['flight', 'bus', 'train'],
      message: '{VALUE} is not a valid transport type'
    },
    required: [true, 'Transport type is required']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Route', routeSchema);
