const Job = require("../models/Job");

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
