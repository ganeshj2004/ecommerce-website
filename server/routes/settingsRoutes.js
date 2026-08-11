const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getSettings);
router.post(
  '/update',
  verifyToken,
  isAdmin,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'hero_banner', maxCount: 1 },
  ]),
  updateSettings
);

module.exports = router;
