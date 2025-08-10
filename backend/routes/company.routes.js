const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');

// Auth middleware (assumed)
const { auth, verifyAdmin } = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(auth);

// Create company (admin only)
router.post('/', verifyAdmin, companyController.createCompany);

// Get all companies
router.get('/', companyController.getAllCompanies);

// Search companies
router.get('/search', companyController.searchCompanies);

// Get company by id
router.get('/:id', companyController.getCompanyById);

// Update company by id
router.put('/:id', companyController.updateCompany);

// Delete company by id (admin only)
router.delete('/:id', verifyAdmin, companyController.deleteCompany);

// Get logged-in user's company profile
router.get('/profile/me', companyController.getMyCompanyProfile);

// Update logged-in user's company profile
router.put('/profile/me', companyController.updateMyCompanyProfile);

// Get jobs posted by company
router.get('/:companyId/jobs', companyController.getJobsByCompany);

// Get applications for company jobs
router.get('/:companyId/applications', companyController.getApplicationsForCompanyJobs);

module.exports = router;
