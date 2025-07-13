const Application = require('../models/Application');

// Apply to a job
exports.applyToJob = async (req, res) => {
  const { jobId } = req.params;
  const { qualifications, coverLetter } = req.body;

  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: 'Resume file is required' });
  }

  try {
    const alreadyApplied = await Application.findOne({ applicant: req.user.id, job: jobId });
    if (alreadyApplied) return res.status(400).json({ error: 'You have already applied to this job.' });

    const application = await Application.create({
      applicant: req.user.id,
      job: jobId,
      qualifications,
      coverLetter,
      resumeUrl: req.file.path // Cloudinary URL
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {
    res.status(500).json({ error: 'Failed to apply', details: err.message });
  }
};
