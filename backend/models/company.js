const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  policyText: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    fileSize: Number,
    fileType: String,
    originalName: String
  }
}, {
  timestamps: true
});

// Index for faster queries
companySchema.index({ name: 1 });

module.exports = mongoose.model('Company', companySchema);