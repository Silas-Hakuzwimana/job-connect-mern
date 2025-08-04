const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Job' },
  itemType: { type: String, enum: ['job', 'application'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
