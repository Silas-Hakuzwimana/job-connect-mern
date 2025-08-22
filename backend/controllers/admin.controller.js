const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Qualification = require('../models/Qualification');
const Company = require('../models/Company');

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
  try {
    // Fetch all approved active jobs and populate postedBy user
    const jobs = await Job.find({
      isActive: true,
      status: 'approved',
    }).populate('postedBy', 'name email company'); // ensure postedBy.company exists if needed

    // Collect all company IDs from jobs
    const companyIds = jobs
      .filter((job) => job.company)
      .map((job) => job.company.toString());

    // Fetch companies once
    const companies = await Company.find({ _id: { $in: companyIds } });
    const companyMap = companies.reduce((acc, c) => {
      acc[c._id.toString()] = c.name;
      return acc;
    }, {});

    // Add companyName field to each job
    const jobsWithCompanyName = jobs.map((job) => {
      let companyName = 'Unknown Company';

      if (job.company && companyMap[job.company.toString()]) {
        companyName = companyMap[job.company.toString()];
      } else if (job.postedBy?.company?.name) {
        companyName = job.postedBy.company.name;
      }

      return {
        ...job.toObject(),
        companyName,
      };
    });

    res.json(jobsWithCompanyName);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
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
      .populate('applicant', 'name email phone location bio profilePic') // full applicant details
      .populate({
        path: 'job',
        select: 'title type salary location description qualifications company',
        populate: {
          path: 'company', // assuming job.company is a ref to a Company model
          select: 'name', // only get company name
        },
      });

    // Transform the response to include a clean structure
    const formattedApplications = applications.map((app) => ({
      _id: app._id,
      applicantDetails: app.applicant,
      jobDetails: {
        _id: app.job._id,
        title: app.job.title,
        company: app.job.company?.name || app.job.company || 'Not specified',
        location: app.job.location,
        type: app.job.type,
        salary: app.job.salary,
        description: app.job.description,
        qualifications: app.job.qualifications,
      },
      qualifications: app.qualifications,
      coverLetter: app.coverLetter,
      resumeUrl: app.resumeUrl,
      coverLetterUrl: app.coverLetterUrl,
      status: app.status,
      appliedAt: app.appliedAt,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    }));

    res.json(formattedApplications);
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
    const totalCompanies = await Company.countDocuments();
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

//company controllers

// GET /admin/companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate('createdBy', 'name email') // Include creator info if needed
      .sort({ createdAt: -1 }); // Latest first

    res.status(200).json({ data: companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Failed to fetch companies' });
  }
};

// Optional: GET /admin/companies/:id
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      'createdBy',
      'name email',
    );

    if (!company) return res.status(404).json({ message: 'Company not found' });

    res.status(200).json({ data: company });
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ message: 'Failed to fetch company' });
  }
};
