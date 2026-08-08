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

const updateSettings = async (req, res) => {
  try {
    const updates = req.body; // e.g. { company_name: "AquaCraft", phone: "123", ... }

    if (req.file) {
      let logoUrl = req.file.path;
      if (logoUrl && (logoUrl.startsWith('http://') || logoUrl.startsWith('https://'))) {
        // Cloudinary storage: use full HTTPS URL
        updates.company_logo = logoUrl;
      } else if (req.file.filename) {
        // Local disk storage: use /uploads/filename
        updates.company_logo = `/uploads/${req.file.filename}`;
      } else {
        updates.company_logo = `/uploads/${path.basename(logoUrl || '')}`;
      }
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
