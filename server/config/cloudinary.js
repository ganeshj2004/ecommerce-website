const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'demo_cloud' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Local Storage Fallback
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

let uploadStorage;

if (isCloudinaryConfigured) {
  uploadStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'aquacraft_bottles',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'ico', 'svg', 'gif', 'bmp', 'tiff'],
    },
  });
  console.log('✅ Cloudinary Storage initialized');
} else {
  uploadStorage = localStorage;
  console.log('ℹ️ Using Local Disk Storage for Uploads (Set Cloudinary ENV vars to switch)');
}

const upload = multer({ storage: uploadStorage });

module.exports = {
  cloudinary,
  upload,
  isCloudinaryConfigured,
};
