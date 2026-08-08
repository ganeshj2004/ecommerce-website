const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update/:id', updateCartQuantity);
router.delete('/remove/:id', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;
