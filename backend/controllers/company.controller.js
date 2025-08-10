const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

// Create company (you already have)
exports.createCompany = async (req, res) => {
  try {
    const company = new Company({ ...req.body, createdBy: req.user.id });
    await company.save();
    res.status(201).json(company);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all companies (you already have)
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('createdBy', 'name email');
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};

// Get company by id (you already have)
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      'createdBy',
      'name email',
    );
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching company' });
  }
};

// Update company by id (you already have)
exports.updateCompany = async (req, res) => {
  try {
    const updated = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update company' });
  }
};

// Delete company by id (you already have)
exports.deleteCompany = async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: 'Company deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete company' });
  }
};

// Get company profile for currently authenticated user
exports.getMyCompanyProfile = async (req, res) => {
  try {
    // Assuming one company per user
    const company = await Company.findOne({ createdBy: req.user.id });
    if (!company)
      return res.status(404).json({ message: 'Company profile not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your company profile' });
  }
};

// Update company profile for currently authenticated user
exports.updateMyCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { createdBy: req.user.id },
      req.body,
      { new: true },
    );
    if (!company)
      return res.status(404).json({ message: 'Company profile not found' });
    res.json(company);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update your company profile' });
  }
};

// Get jobs posted by company (for dashboard)
exports.getJobsByCompany = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.params.companyId });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Get applications for jobs posted by company (optional)
exports.getApplicationsForCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.params.companyId }).select(
      '_id',
    );
    const jobIds = jobs.map((j) => j._id);
    const applications = await Application.find({
      job: { $in: jobIds },
    }).populate('applicant', 'name email');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// Search companies by name or industry (optional)
exports.searchCompanies = async (req, res) => {
  try {
    const { q } = req.query;
    const regex = new RegExp(q, 'i'); // case-insensitive search
    const companies = await Company.find({
      $or: [{ name: regex }, { industry: regex }],
    }).limit(20);
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
};
