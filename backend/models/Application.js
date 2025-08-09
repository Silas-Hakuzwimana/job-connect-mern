const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // For fast lookup on applicant
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true, // For fast lookup on job
  },
  qualifications: {
    type: [String],
    default: [],
    validate: {
      validator: function (arr) {
        // Each qualification should be a non-empty string
        return arr.every((q) => typeof q === 'string' && q.trim().length > 0);
      },
      message: 'Qualifications must be an array of non-empty strings',
    },
  },
  coverLetter: {
    type: String,
    trim: true, // Remove trailing spaces
    default: '',
  },
  resumeUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        // Basic URL pattern validation (optional, can be improved)
        return !v || /^https?:\/\/.+\..+/.test(v);
      },
      message: 'Invalid resume URL format',
    },
    default: '',
  },
  coverLetterUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return !v || /^https?:\/\/.+\..+/.test(v);
      },
      message: 'Invalid cover letter URL format',
    },
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending',
    lowercase: true,
    trim: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
    immutable: true, // Prevent accidental modification after creation
  },

  // Embedded job details snapshot
  jobDetails: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      immutable: true,
    },
    title: { type: String, required: true, trim: true },
    company: { type: String, default: '', trim: true },
    location: { type: String, default: '', trim: true },
    type: { type: String, default: '', trim: true },
    salary: { type: Number, default: 0, min: 0 },
    description: { type: String, default: '', trim: true },
    qualifications: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.every((q) => typeof q === 'string' && q.trim().length > 0);
        },
        message: 'Job qualifications must be an array of non-empty strings',
      },
    },
  },

  // Embedded applicant details snapshot
  applicantDetails: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      immutable: true,
    },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          // Basic email regex, can be replaced with validator package
          return /^\S+@\S+\.\S+$/.test(v);
        },
        message: 'Invalid email format',
      },
    },
    phone: { type: String, default: '', trim: true },
    location: { type: String, default: '', trim: true },
    bio: { type: String, default: '', trim: true },
    profilePic: {
      type: String,
      default: '',
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/.+\..+/.test(v);
        },
        message: 'Invalid profile picture URL',
      },
    },
  },
});

// Create a compound unique index to prevent duplicate applications for same user-job pair
applicationSchema.index({ applicant: 1, job: 1 }, { unique: true });

applicationSchema.set('timestamps', true);

module.exports = mongoose.model('Application', applicationSchema);
