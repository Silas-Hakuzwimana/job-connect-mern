const mongoose = require('mongoose');

const qualificationSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional, if user-generated
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Qualification', qualificationSchema);
