const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Qualification = require('../models/Qualification');

// Get all users
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

// Change user role
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User role updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

// Get all jobs
exports.getAllJobs = async (req, res) => {
  const jobs = await Job.find().populate('postedBy');
  res.json(jobs);
};

exports.approveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByIdAndUpdate(
      jobId,
      { status: 'approved' },
      { new: true },
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ message: 'Job approved', job });
  } catch (error) {
    console.error('Error approving job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.rejectJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByIdAndUpdate(
      jobId,
      { status: 'rejected' },
      { new: true },
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ message: 'Job rejected', job });
  } catch (error) {
    console.error('Error rejecting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    await Job.findByIdAndDelete(id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

// View all applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('applicant', 'name email') // <-- Ensure only the necessary fields are loaded
      .populate('job', 'title company');

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};

// View all qualifications
exports.getAllQualifications = async (req, res) => {
  const qualifications = await Qualification.find().sort({ title: 1 });
  res.json(qualifications);
};

// Delete qualification
exports.deleteQualification = async (req, res) => {
  const { id } = req.params;

  try {
    await Qualification.findByIdAndDelete(id);
    res.json({ message: 'Qualification deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobseekers = await User.countDocuments({ role: 'jobseeker' });
    const totalCompanies = await User.countDocuments({ role: 'company' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const pendingCompanies = await User.countDocuments({
      role: 'company',
      approved: false,
    });
    const pendingJobs = await Job.countDocuments({ status: 'pending' });
    const totalJobs = await Job.countDocuments();
    const approvedJobs = await Job.countDocuments({ status: 'approved' });
    const rejectedJobs = await Job.countDocuments({ status: 'rejected' });
    const totalApplications = await Application.countDocuments();

    res.json({
      totalUsers,
      totalJobseekers,
      totalCompanies,
      totalAdmins,
      pendingCompanies,
      pendingJobs,
      totalJobs,
      approvedJobs,
      rejectedJobs,
      totalApplications,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load stats' });
  }
};
