const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyRazorpayPayment } = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/create-order', verifyToken, createRazorpayOrder);
router.post('/verify-signature', verifyToken, verifyRazorpayPayment);

module.exports = router;
