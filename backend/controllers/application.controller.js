const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const logger = require('../services/logger.service'); // Optional logging

// Apply to a job
exports.applyToJob = async (req, res) => {
  const { jobId } = req.params;
  const { qualifications, coverLetter } = req.body;

  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: 'Resume file is required' });
  }

  try {
    const alreadyApplied = await Application.findOne({
      applicant: req.user.id,
      job: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({ error: 'You have already applied to this job.' });
    }

    const application = await Application.create({
      applicant: req.user.id,
      job: jobId,
      qualifications,
      coverLetter,
      resumeUrl: req.file.path, // Cloudinary URL
    });

    logger.info('New application submitted', { user: req.user.email, jobId });

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (err) {
    logger.error('Failed to apply', err);
    res.status(500).json({ error: 'Failed to apply', details: err.message });
  }
};

// View your applications (for jobseekers or admin/employers)
exports.getApplications = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'jobseeker') {
      filter.applicant = req.user.id;
    } else if (req.user.role === 'employer') {
      const employerJobs = await Job.find({ createdBy: req.user.id }).select('_id');
      filter.job = { $in: employerJobs.map(job => job._id) };
    }

    const applications = await Application.find(filter)
      .populate('job', 'title location')
      .populate('applicant', 'name email');

    res.status(200).json({ applications });
  } catch (err) {
    logger.error('Failed to fetch applications', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};
