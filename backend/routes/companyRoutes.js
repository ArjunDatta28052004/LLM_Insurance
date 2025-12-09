const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/companyController');
const upload = require('../middleware/upload');

// Get all companies
router.get('/companies', CompanyController.getAllCompanies);

// Get single company
router.get('/companies/:id', CompanyController.getCompany);

// Upload policy
router.post('/upload-policy', upload.single('policy'), CompanyController.uploadPolicy);

// Delete company
router.delete('/companies/:id', CompanyController.deleteCompany);

module.exports = router;