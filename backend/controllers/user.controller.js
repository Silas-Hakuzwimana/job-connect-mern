const User = require('../models/User');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get single user by id (admin or self)
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  if (req.user.role !== 'admin' && req.user.id !== id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch {
    res.status(400).json({ error: 'Invalid user ID' });
  }
};

// Update user (admin or self)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  if (req.user.role !== 'admin' && req.user.id !== id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    const updates = { ...req.body };
    delete updates.password; // No direct password update here; use separate endpoint
    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Update failed', details: err.message });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch {
    res.status(400).json({ error: 'Deletion failed' });
  }
};

exports.uploadProfilePic = async (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: 'Upload failed' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.profilePic = req.file.path; // this will be a Cloudinary URL
    await user.save();

    res.json({ message: 'Profile picture updated', profilePic: user.profilePic });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
};
