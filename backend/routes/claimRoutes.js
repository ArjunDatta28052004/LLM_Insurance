const express = require('express');
const router = express.Router();
const ClaimController = require('../controllers/claimController');
const upload = require('../middleware/upload');

// Query claim
router.post('/query-claim', upload.single('queryDocument'), ClaimController.queryClaim);

module.exports = router;