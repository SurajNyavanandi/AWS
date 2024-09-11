const express = require('express');
const companyController = require('../controllers/company');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.post('/create', verifyToken, companyController.createCompany);

module.exports = router;
