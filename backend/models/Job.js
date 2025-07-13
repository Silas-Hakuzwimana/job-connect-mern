const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['full-time', 'part-time', 'contract'], default: 'full-time' },
  salary: { type: Number },
  qualifications: {
    type: [String],
    required: true,          // <-- ensure this array must be provided
    validate: [arrayLimit, 'At least one qualification is required.']
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Custom validator for qualifications length
function arrayLimit(val) {
  return val.length > 0;
}

// Optional: Virtual field for flagging if qualifications are present
jobSchema.virtual('hasRequiredQualifications').get(function() {
  return this.qualifications && this.qualifications.length > 0;
});

module.exports = mongoose.model('Job', jobSchema);
