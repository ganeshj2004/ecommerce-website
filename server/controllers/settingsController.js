const db = require('../config/db');
const path = require('path');

const getSettings = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT key_name, key_value FROM settings');
    const settings = {};
    rows.forEach((row) => {
      settings[row.key_name] = row.key_value;
    });

    return res.status(200).json({ settings });
  } catch (err) {
    console.error('getSettings error:', err);
    return res.status(500).json({ message: 'Server error fetching website settings.' });
  }
};

const getUploadedFileUrl = (file) => {
  if (!file) return null;

  const filePath = file.path || file.secure_url || '';
  if (filePath && (filePath.startsWith('http://') || filePath.startsWith('https://'))) {
    return filePath;
  }
  if (file.filename) {
    return `/uploads/${file.filename}`;
  }
  return `/uploads/${path.basename(filePath || '')}`;
};

const updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    const files = req.files || {};

    if (files.logo?.[0]) {
      updates.company_logo = getUploadedFileUrl(files.logo[0]);
    }

    if (files.hero_banner?.[0]) {
      updates.hero_banner = getUploadedFileUrl(files.hero_banner[0]);
    }

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        const [existing] = await db.query('SELECT * FROM settings WHERE key_name = ?', [key]);
        if (existing.length > 0) {
          await db.query('UPDATE settings SET key_value = ? WHERE key_name = ?', [String(value), key]);
        } else {
          await db.query('INSERT INTO settings (key_name, key_value) VALUES (?, ?)', [key, String(value)]);
        }
      }
    }

    return res.status(200).json({ message: 'Website content & settings updated successfully.' });
  } catch (err) {
    console.error('updateSettings error:', err);
    return res.status(500).json({ message: 'Server error updating settings.' });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
