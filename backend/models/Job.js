const mongoose = require('mongoose');

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
    salary: { type: Number },
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

    // ✅ Add this field:
    status: {
      type: String,
      enum: ['approved', 'rejected', 'pending'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

// Custom validator for qualifications length
function arrayLimit(val) {
  return val.length > 0;
}

// Optional: Virtual field for flagging if qualifications are present
jobSchema.virtual('hasRequiredQualifications').get(function () {
  return this.qualifications && this.qualifications.length > 0;
});

module.exports = mongoose.model('Job', jobSchema);
