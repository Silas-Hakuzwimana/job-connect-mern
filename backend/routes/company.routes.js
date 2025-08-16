const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');

// Auth middleware
const { auth, verifyAdmin } = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(auth);

// --- Company CRUD ---
router.post('/', verifyAdmin, companyController.createCompany); // Admin only
router.get('/', companyController.getAllCompanies);
router.get('/search', companyController.searchCompanies);
router.get('/:id', companyController.getCompanyById);
router.put('/:id', companyController.updateCompany);
router.delete('/:id', verifyAdmin, companyController.deleteCompany); // Admin only

// --- Logged-in user's company profile ---
router.get('/profile/me', companyController.getMyCompanyProfile);
router.put('/profile/me', companyController.updateMyCompanyProfile);
router.get('/company-id',companyController.getUserCompanyById); //get company._id

// --- Jobs and Applications ---
router.get('/dashboard/jobs', companyController.getCompanyJobs); // dashboard jobs with counts
router.get('/:companyId/jobs', companyController.getJobsByCompany);
router.get('/:companyId/applications', companyController.getApplicationsForCompanyJobs);

// --- Dashboard specific ---
router.get('/dashboard/stats', companyController.getStats);
router.get('/notifications', companyController.getNotifications);

module.exports = router;
