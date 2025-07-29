const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');

// Auth middleware (optional)
const { auth, verifyAdmin } = require('../middlewares/auth.middleware');

// All routes are protected
router.use(auth);

router.post('/', verifyAdmin, companyController.createCompany);
router.get('/', companyController.getAllCompanies);
router.get('/:id', companyController.getCompanyById);
router.put('/:id', companyController.updateCompany);
router.delete('/:id', verifyAdmin, companyController.deleteCompany);

module.exports = router;
