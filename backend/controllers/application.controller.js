const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const logger = require('../services/logger.service'); // Optional logging

// Apply to a job
exports.applyToJob = async (req, res) => {
  const { jobId } = req.params;
  const { qualifications, coverLetter, resumeUrl, coverLetterUrl } = req.body;

  try {
    const alreadyApplied = await Application.findOne({
      applicant: req.user.id,
      job: jobId,
    });

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ error: 'You have already applied to this job.' });
    }

    // qualifications might be a stringified JSON
    let parsedQualifications = [];
    if (qualifications) {
      parsedQualifications =
        typeof qualifications === 'string'
          ? JSON.parse(qualifications)
          : qualifications;
    }

    const application = await Application.create({
      applicant: req.user.id,
      job: jobId,
      qualifications: parsedQualifications,
      coverLetter, 
      resumeUrl, 
      coverLetterUrl,
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (err) {
    console.error('Failed to apply', err);
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
      const employerJobs = await Job.find({ createdBy: req.user.id }).select(
        '_id',
      );
      filter.job = { $in: employerJobs.map((job) => job._id) };
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
