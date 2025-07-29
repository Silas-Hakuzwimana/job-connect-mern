import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true }, // job or application
  itemType: { type: String, enum: ['job', 'application'], required: true },
}, { timestamps: true });

export default mongoose.model('Bookmark', bookmarkSchema);
