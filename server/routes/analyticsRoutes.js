const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, isAdmin, getAnalytics);

module.exports = router;
