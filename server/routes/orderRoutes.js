const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, createOrder);
router.get('/my-orders', verifyToken, getUserOrders);

// Admin Routes
router.get('/all', verifyToken, isAdmin, getAllOrders);
router.put('/status/:id', verifyToken, isAdmin, updateOrderStatus);

module.exports = router;
