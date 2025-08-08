const mongoose = require('mongoose');

function arrayLimit(val) {
  return val.length > 0;
}

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract'],
      default: 'full-time',
    },
    salary: { type: Number, required: true },
    qualifications: {
      type: [String],
      required: true,
      validate: [arrayLimit, 'At least one qualification is required.'],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['approved', 'rejected', 'pending'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

jobSchema.virtual('hasRequiredQualifications').get(function () {
  return this.qualifications && this.qualifications.length > 0;
});

jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
