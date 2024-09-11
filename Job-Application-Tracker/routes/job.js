const express = require('express');
const jobController = require('../controllers/job');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.post('/create', verifyToken, jobController.createJob); 
router.get('/list', verifyToken, jobController.getJobs); 
router.post('/apply', verifyToken, jobController.applyToJob); 
router.get('/applied-jobs', verifyToken, jobController.getAppliedJobs); 

module.exports = router;
