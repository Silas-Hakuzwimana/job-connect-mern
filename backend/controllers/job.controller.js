const Job = require('../models/Job');
const User = require('../models/User');
const Company = require('../models/Company');

exports.createJob = async (req, res) => {
  try {
    const { qualifications, ...jobData } = req.body;

    if (!qualifications || !qualifications.length) {
      return res
        .status(400)
        .json({ error: 'At least one qualification is required.' });
    }

    // Find company by logged-in user ID
    const company = await Company.findOne({ createdBy: req.user.id });
    if (!company) {
      return res.status(404).json({ error: 'Your company profile not found.' });
    }

    // Create job referencing company ObjectId
    const job = await Job.create({
      ...jobData,
      qualifications,
      company: company._id,
      postedBy: req.user.id,
    });

    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ error: 'Job creation failed', details: err.message });
  }
};

exports.getAllJobs = async (req, res) => {
  const jobs = await Job.find({ isActive: true, status: 'approved' }).populate(
    'postedBy',
    'name email',
  );
  res.json(jobs);
};

/**
 * Get all active & approved jobs
 */
exports.getActiveApprovedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true, isApproved: true });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch {
    res.status(400).json({ error: 'Invalid job ID' });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.postedBy.toString() !== req.user.id)
      return res.status(403).json({ error: 'Unauthorized' });

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: 'Update failed', details: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.postedBy.toString() !== req.user.id)
      return res.status(403).json({ error: 'Unauthorized' });

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch {
    res.status(400).json({ error: 'Deletion failed' });
  }
};

/**
 * Get all active & approved jobs with qualification flag for logged-in user
 */

exports.flagJobsQualificationStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Find user & populate qualifications
    const user = await User.findById(userId).populate('qualifications');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Extract user qualification titles as a Set for fast lookup
    const userQualTitles = new Set(user.qualifications.map((q) => q.title));

    // 3. Get job IDs from request body
    const { jobIds } = req.body;

    if (!jobIds || !Array.isArray(jobIds)) {
      return res.status(400).json({ message: 'jobIds must be an array' });
    }

    // 4. Fetch jobs by IDs, active & approved only
    const jobs = await Job.find({
      _id: { $in: jobIds },
      isActive: true,
      status: 'approved',
    });

    // 5. Build result object { jobId: true/false }
    const flags = {};
    jobs.forEach((job) => {
      // Check if any job qualification matches user qualifications
      const isQualified = job.qualifications.some((q) => userQualTitles.has(q));
      flags[job._id.toString()] = isQualified;
    });

    // For jobs not found (or inactive/ not approved), mark false
    jobIds.forEach((id) => {
      if (!(id in flags)) flags[id] = false;
    });

    return res.json(flags);
  } catch (err) {
    console.error('Error in flagJobsQualificationStatus:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
