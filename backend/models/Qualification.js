const mongoose = require('mongoose');

const qualificationSchema = new mongoose.Schema(
  {
    owner: { type: String, required: true },
    title: {
      type: String,
      required: true,
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
      required: true,
    },
  },
  { timestamps: true },
);

qualificationSchema.index({ title: 1, createdBy: 1 }, { unique: true });

qualificationSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Qualification', qualificationSchema);
