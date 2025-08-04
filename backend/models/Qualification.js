const mongoose = require('mongoose');

const qualificationSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  title: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
  },
  description: { 
    type: String, 
    default: '', 
    maxlength: 500,
    trim: true,
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Qualification', qualificationSchema);

