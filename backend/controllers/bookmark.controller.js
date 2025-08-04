const Bookmark = require('../models/Bookmark');

// Add a bookmark (job or application)
exports.addBookmark = async (req, res, next) => {
  try {
    const { itemId, itemType } = req.body;
    const userId = req.user._id;

    // Prevent duplicates
    const exists = await Bookmark.findOne({ userId, itemId, itemType });
    if (exists) return res.status(400).json({ message: 'Already bookmarked' });

    const bookmark = await Bookmark.create({ userId, itemId, itemType });
    res.status(201).json({ message: 'Bookmarked successfully', bookmark });
  } catch (error) {
    next(error);
  }
};

// Get all bookmarks for a user
exports.getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const bookmarks = await Bookmark.find({ userId });
    res.json(bookmarks);
  } catch (error) {
    next(error);
  }
};

// Remove a bookmark
exports.removeBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const deleted = await Bookmark.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ message: 'Bookmark not found' });

    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Count total bookmarks for this user
    const totalBookmarks = await Bookmark.countDocuments({ userId });

    // Count bookmarks specifically for jobs
    const jobBookmarks = await Bookmark.countDocuments({ userId, itemType: 'job' });

    // Count bookmarks specifically for applications
    const applicationBookmarks = await Bookmark.countDocuments({ userId, itemType: 'application' });

    res.status(200).json({
      totalBookmarks,
      jobBookmarks,
      applicationBookmarks,
      message: 'Jobseeker dashboard stats loaded successfully'
    });

  } catch (error) {
    console.error('🔥 Error loading dashboard stats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

