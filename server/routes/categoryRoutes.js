const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getCategories);

// Admin Routes
router.post('/', verifyToken, isAdmin, upload.single('image'), createCategory);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), updateCategory);
router.delete('/:id', verifyToken, isAdmin, deleteCategory);

module.exports = router;
