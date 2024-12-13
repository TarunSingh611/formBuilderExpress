// models/Progress.js
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responses: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index for form and user
progressSchema.index({ form: 1, user: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress;