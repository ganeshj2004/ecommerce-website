const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin Routes
router.post('/', verifyToken, isAdmin, upload.single('image'), createProduct);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

module.exports = router;
