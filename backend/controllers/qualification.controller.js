const Qualification = require('../models/Qualification');

exports.createQualification = async (req, res) => {
  const { title, description } = req.body;

  try {
    const exists = await Qualification.findOne({ title });
    if (exists) return res.status(400).json({ error: 'Qualification already exists' });

    const qualification = await Qualification.create({
      title,
      description,
      createdBy: req.user.id
    });

    res.status(201).json({ message: 'Qualification added', qualification });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add qualification' });
  }
};

exports.getAllQualifications = async (req, res) => {
  const qualifications = await Qualification.find().sort({ title: 1 });
  res.json(qualifications);
};
