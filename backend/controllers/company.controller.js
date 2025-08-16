const mongoose = require('mongoose');
const Company = require('../models/Company');
const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

/**
 * Create a new company (Admin only)
 */
exports.createCompany = async (req, res) => {
  try {
    const company = new Company({ ...req.body, createdBy: req.user.id });
    await company.save();
    res.status(201).json(company);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get Company for loggedIn-User
 */
exports.getUserCompanyById = async (req, res) => {
  try {
    const company = await Company.findOne({ createdBy: req.user._id });
    res.json(company);
  } catch {
    res.status(500).json({ error: 'Failed to fetch company' });
  }
};

/**
 * Get all companies
 */
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('createdBy', 'name email');
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};

/**
 * Get a company by ID
 */
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

/**
 * Update company by ID
 */
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

/**
 * Delete company by ID (Admin only)
 */
exports.deleteCompany = async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: 'Company deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete company' });
  }
};

/**
 * Get the profile of the currently authenticated user's company
 */
exports.getMyCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findOne({ createdBy: req.user.id });
    if (!company)
      return res.status(404).json({ message: 'Company profile not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your company profile' });
  }
};

/**
 * Update the profile of the currently authenticated user's company
 */
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

/**
 * Get jobs posted by a specific company
 */
exports.getJobsByCompany = async (req, res) => {
  try {
    let companyId = req.params.companyId;

    // If no companyId is provided in params, get it from the logged-in user's company
    if (!companyId) {
      const company = await Company.findOne({ createdBy: req.user.id });
      if (!company) {
        return res.status(404).json({ error: 'Company not found for user' });
      }
      companyId = company._id.toString();
    }

    // Validate ObjectId format
    // if (!companyId.match(/^[0-9a-fA-F]{24}$/)) {
    //   return res.status(400).json({ message: 'Invalid company ID' });
    // }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: 'Invalid company ID' });
    }

    // Find company by ID
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Fetch jobs referencing company ObjectId
    const jobs = await Job.find({ company: company._id }).populate(
      'postedBy',
      'name email',
    );

    res.json({ company: company.name, jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

/**
 * Get applications for jobs posted by a specific company
 */
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

/**
 * Search companies by name or industry
 */
exports.searchCompanies = async (req, res) => {
  try {
    const { q } = req.query;
    const regex = new RegExp(q, 'i');
    const companies = await Company.find({
      $or: [{ name: regex }, { industry: regex }],
    }).limit(20);
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
};

/**
 * Fetch jobs for dashboard with counts for a specific company
 * If companyId not provided, tries to find company by logged-in user
 */
exports.getCompanyJobs = async (req, res) => {
  try {
    let companyId = req.query.companyId;

    // If no companyId in query, use logged-in user to find company
    if (!companyId) {
      const company = await Company.findOne({ createdBy: req.user.id });
      if (!company) {
        return res.status(404).json({ error: 'Company not found for user' });
      }
      companyId = company._id;
    }

    // Validate companyId
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ error: 'Invalid company ID' });
    }

    // Fetch jobs referencing company ObjectId
    const jobs = await Job.find({ company: companyId })
      .sort({ updatedAt: -1 })
      .populate('postedBy', 'name email');

    // Build counts
    const counts = {
      total: jobs.length,
      active: jobs.filter((j) => j.isActive).length,
      approved: jobs.filter((j) => j.status === 'approved').length,
      pending: jobs.filter((j) => j.status === 'pending').length,
      rejected: jobs.filter((j) => j.status === 'rejected').length,
    };

    res.json({ counts, jobs });
  } catch (err) {
    console.error('Error fetching company jobs:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

/**
 * Fetch dashboard stats
 */
exports.getStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const totalApplicants = await Application.countDocuments();

    res.json({ totalJobs, totalApplicants });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      console.log('req.user is missing:', req.user);
      return res.status(401).json({ error: 'Unauthorized: user not found' });
    }

    const userId = req.user._id;

    const notifications = await Notification.find({
      user: userId,
      hiddenBy: { $ne: userId }, // exclude hidden notifications
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};
