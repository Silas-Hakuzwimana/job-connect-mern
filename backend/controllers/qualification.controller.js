const Qualification = require('../models/Qualification');
const User = require('../models/User');

// Create Qualification
exports.createQualification = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Check for existing qualification title
    const existing = await Qualification.findOne({ title: title.trim() });
    if (existing) {
      return res.status(400).json({ error: 'Qualification already exists' });
    }

    // Get current user's name using user ID from auth middleware
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const qualification = new Qualification({
      title: title || '',
      description: description || '',
      owner: user.name, 
      createdBy: user._id,
    });

    await qualification.save();
    return res
      .status(201)
      .json({ message: 'Qualification created successfully', qualification });
  } catch (error) {
    console.error('Create Qualification Error:', error.message);
    return res
      .status(500)
      .json({ error: 'Server error while creating qualification' });
  }
};


exports.saveUserQualifications = async (req, res) => {
  try {
    const { qualifications } = req.body; // array of titles or IDs
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch existing qualifications
    const savedQuals = await Qualification.find({
      title: { $in: qualifications },
    });

    // Determine which titles are new
    const existingTitles = savedQuals.map(q => q.title);
    const newTitles = qualifications.filter(t => !existingTitles.includes(t));

    // Insert new qualifications with required fields
    const newQuals = await Qualification.insertMany(
      newTitles.map(title => ({
        title,
        createdBy: user._id,
        owner: user.name,
      }))
    );

    // Combine all qualifications
    const allQuals = [...savedQuals, ...newQuals];
    user.qualifications = allQuals.map(q => q._id);
    await user.save();

    // Return updated user with populated qualifications
    const updatedUser = await User.findById(user._id)
      .populate('qualifications', 'title')
      .select('-password');

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get All Qualifications
exports.getAllQualifications = async (req, res) => {
  try {
    const qualifications = await Qualification.find().sort({ title: 1 });
    return res.status(200).json(qualifications);
  } catch (error) {
    console.error('Fetch Qualifications Error:', error.message);
    return res
      .status(500)
      .json({ error: 'Server error while fetching qualifications' });
  }
};

// Get Single Qualification
exports.getQualificationById = async (req, res) => {
  try {
    const qualification = await Qualification.findById(req.params.id);
    if (!qualification)
      return res.status(404).json({ error: 'Qualification not found' });
    return res.status(200).json(qualification);
  } catch (error) {
    console.error('Get Qualification Error:', error.message);
    return res
      .status(500)
      .json({ error: 'Server error while retrieving qualification' });
  }
};

// Update Qualification
exports.updateQualification = async (req, res) => {
  try {
    const { title, description } = req.body;

    const qualification = await Qualification.findById(req.params.id);
    if (!qualification)
      return res.status(404).json({ error: 'Qualification not found' });

    if (title) qualification.title = title.trim();
    if (description !== undefined) qualification.description = description;

    await qualification.save();
    return res
      .status(200)
      .json({ message: 'Qualification updated', qualification });
  } catch (error) {
    console.error('Update Qualification Error:', error.message);
    return res
      .status(500)
      .json({ error: 'Server error while updating qualification' });
  }
};

// Delete Qualification
exports.deleteQualification = async (req, res) => {
  try {
    const qualification = await Qualification.findByIdAndDelete(req.params.id);
    if (!qualification)
      return res.status(404).json({ error: 'Qualification not found' });

    return res.status(200).json({ message: 'Qualification deleted' });
  } catch (error) {
    console.error('Delete Qualification Error:', error.message);
    return res
      .status(500)
      .json({ error: 'Server error while deleting qualification' });
  }
};
