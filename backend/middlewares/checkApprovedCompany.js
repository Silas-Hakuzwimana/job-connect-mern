const Company = require('../models/Company');

const checkApprovedCompany = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Ensure the user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Access denied. Only approved employers can post jobs.' });
    }

    // Find the company created by this user or linked to user
    const company = await Company.findOne({
      users: userId
    });

    if (!company) {
      return res.status(403).json({ error: 'No company found for this user.' });
    }

    if (company.status !== 'approved') {
      return res.status(403).json({ error: 'Company account not approved yet. Cannot post jobs.' });
    }

    // All good
    req.company = company; // optional: pass company to next handlers
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = checkApprovedCompany;
