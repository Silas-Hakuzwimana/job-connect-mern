const User = require('../models/User.js');
const Application = require('../models/Application.js');
const Bookmark = require('../models/Bookmark.js');

exports.getJobseekerDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch job seeker info (basic profile)
    const user = await User.findById(userId).select('-password');

    // Count total applications
    const totalApplications = await Application.countDocuments({ applicant: userId });

    // Count total bookmarks
    const totalBookmarks = await Bookmark.countDocuments({ user: userId });

    // Recent applications
    const recentApplications = await Application.find({ applicant: userId })
      .populate('job', 'title company location')
      .sort({ createdAt: -1 })
      .limit(5);

    // Bookmarked jobs
    const recentBookmarks = await Bookmark.find({ user: userId })
      .populate('job', 'title company location')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      user,
      stats: {
        totalApplications,
        totalBookmarks,
      },
      recentApplications,
      recentBookmarks,
    });
  } catch (error) {
    next(error);
  }
};
