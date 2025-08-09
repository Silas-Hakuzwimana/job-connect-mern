const User = require('../models/User.js');
const Application = require('../models/Application.js');
const Bookmark = require('../models/Bookmark.js');
const bcrypt = require('bcryptjs');

exports.jobseekerProfile = async (req, res) => {
  try {
    const jobseeker = await User.findById(req.user.id).select('-password');
    if (!jobseeker)
      return res.status(404).json({ message: 'Profile not found' });
    res.json(jobseeker);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getJobseekerDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');

    const totalApplications = await Application.countDocuments({
      applicant: userId,
    });

    const totalBookmarks = await Bookmark.countDocuments({
      userId: userId,
    });

    const recentApplications = await Application.find({ applicant: userId })
      .populate('job', 'title company location')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentBookmarks = await Bookmark.find({
      userId: userId,
      itemType: 'job',
    })
      .populate('itemId') // Populates all fields from the Job model
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();

    res.json({
      user,
      stats: { totalApplications, totalBookmarks },
      recentApplications,
      bookmarks: recentBookmarks,
    });

    console.log('Total bookmarks count:', totalBookmarks);
    console.log('Total applications count:', totalApplications);

  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, phone, location, bio, password, profilePic } =
      req.body;

    // Update basic fields
    if (typeof name !== 'undefined') user.name = name;
    if (typeof email !== 'undefined') user.email = email;
    if (typeof phone !== 'undefined') user.phone = phone;
    if (typeof location !== 'undefined') user.location = location;
    if (typeof bio !== 'undefined') user.bio = bio;

    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
    }

    // Handle profile image (existing code here)
    if (req.file) {
      // upload to cloudinary logic...
    } else if (typeof profilePic !== 'undefined') {
      user.profilePic = profilePic;
    }

    await user.save();

    // Re-fetch user and populate qualifications
    const populatedUser = await User.findById(user._id)
      .populate('qualifications', 'title')
      .select(
        '-password -otp -otpExpiresAt -resetPasswordToken -resetPasswordExpires',
      );

    res.status(200).json({ message: 'Profile updated', user: populatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
