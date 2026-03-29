const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required']
  },
  savedRoutes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// bcrypt password hashing goes here in Auth phase

module.exports = mongoose.model('User', userSchema);
