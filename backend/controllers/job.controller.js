const Job = require("../models/Job");
const Qualification  = require('../models/Qualification');

exports.createJob = async (req, res) => {
  try {
    if (!req.body.qualifications || !req.body.qualifications.length) {
      return res
        .status(400)
        .json({ error: "At least one qualification is required." });
    }
    
    const job = await Job.create({ ...req.body, postedBy: req.user.id });
    res.status(201).json(job);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Job creation failed", details: err.message });
  }
};

exports.getAllJobs = async (req, res) => {
  const jobs = await Job.find({ isActive: true }).populate(
    "postedBy",
    "name email"
  );
  res.json(jobs);
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch {
    res.status(400).json({ error: "Invalid job ID" });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.postedBy.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: "Update failed", details: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.postedBy.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch {
    res.status(400).json({ error: "Deletion failed" });
  }
};


exports.getJobsWithQualificationMatch = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get all qualifications owned by user
    const userQualifications = await Qualification.find({ createdBy: userId });
    const userQualTitles = userQualifications.map(q => q.title);

    // 2. Fetch jobs that are active and approved
    const jobs = await Job.find({ isActive: true, status: 'approved' });

    // 3. Compare qualifications for each job
    const jobsWithMatchInfo = jobs.map(job => {
      // job.qualifications is array of required qualification titles
      const matchedQualifications = job.qualifications.filter(q =>
        userQualTitles.includes(q)
      );

      return {
        ...job.toObject(),
        isQualified: matchedQualifications.length > 0,
        matchedQualifications,
        matchCount: matchedQualifications.length,
      };
    });

    res.status(200).json(jobsWithMatchInfo);
  } catch (error) {
    console.error('Error fetching jobs with qualification match:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
