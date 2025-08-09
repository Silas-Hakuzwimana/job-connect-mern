const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const logger = require('../services/logger.service'); // Optional logging

// Apply to a job
exports.applyToJob = async (req, res) => {
  const { jobId } = req.params;
  const { qualifications, coverLetter, resumeUrl, coverLetterUrl } = req.body;

  try {
    // Check if already applied
    const alreadyApplied = await Application.findOne({
      applicant: req.user.id,
      job: jobId,
    });

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ error: 'You have already applied to this job.' });
    }

    // Fetch full job and user details
    const job = await Job.findById(jobId);
    const user = await User.findById(req.user.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Parse qualifications if string
    let parsedQualifications = [];
    if (qualifications) {
      parsedQualifications =
        typeof qualifications === 'string'
          ? JSON.parse(qualifications)
          : qualifications;
    }

    // Create Application and embed job + applicant info
    const application = await Application.create({
      applicant: req.user.id,
      job: jobId,
      qualifications: parsedQualifications,
      coverLetter,
      resumeUrl,
      coverLetterUrl,
      // Embed minimal job details inside application document
      jobDetails: {
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        salary: job.salary,
        description: job.description,
        qualifications: job.qualifications,
      },
      // Embed minimal applicant details inside application document
      applicantDetails: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        profilePic: user.profilePic,
      },
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

exports.getJobsWithAppliedFlag = async (req, res) => {
  const { jobIds } = req.body;

  try {
    const apps = await Application.find({
      applicant: req.user.id,
      job: { $in: jobIds },
    }).select('job');

    const appliedSet = new Set(apps.map((app) => app.job.toString()));

    const flags = {};
    jobIds.forEach((id) => {
      flags[id] = appliedSet.has(id);
    });

    res.json(flags);
  } catch (err) {
    console.error('Failed to get applied flags', err);
    res.status(500).json({ error: 'Failed to get applied flags' });
  }
};

//Get User Applications
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job', 'title location')
      .populate('applicant', 'name email');

    res.status(200).json(applications);
  } catch (err) {
    console.error('Failed to fetch user applications', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};
