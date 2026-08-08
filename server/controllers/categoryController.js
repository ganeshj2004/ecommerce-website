const db = require('../config/db');
const path = require('path');

const getCategories = async (req, res) => {
  try {
    const [categories] = await db.query(`
      SELECT c.*, COUNT(p.id) as product_count 
      FROM categories c 
      LEFT JOIN products p ON c.id = p.category_id 
      GROUP BY c.id 
      ORDER BY c.name ASC
    `);
    return res.status(200).json({ categories });
  } catch (err) {
    console.error('getCategories error:', err);
    return res.status(500).json({ message: 'Server error fetching categories.' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let image_url = req.body.image_url || 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80';

    if (req.file) {
      const p = req.file.path || req.file.secure_url || '';
      if (p.startsWith('http://') || p.startsWith('https://')) {
        image_url = p;
      } else if (req.file.filename) {
        image_url = `/uploads/${req.file.filename}`;
      } else {
        image_url = `/uploads/${path.basename(p)}`;
      }
    }

    const [result] = await db.query(
      'INSERT INTO categories (name, slug, description, image_url) VALUES (?, ?, ?, ?)',
      [name, slug, description || '', image_url]
    );

    return res.status(201).json({
      message: 'Category created successfully',
      categoryId: result.insertId,
    });
  } catch (err) {
    console.error('createCategory error:', err);
    return res.status(500).json({ message: 'Server error creating category.' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const [existing] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    let image_url = existing[0].image_url;
    if (req.file) {
      const p = req.file.path || req.file.secure_url || '';
      if (p.startsWith('http://') || p.startsWith('https://')) {
        image_url = p;
      } else if (req.file.filename) {
        image_url = `/uploads/${req.file.filename}`;
      } else {
        image_url = `/uploads/${path.basename(p)}`;
      }
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    }

    const newSlug = name
      ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : existing[0].slug;

    await db.query(
      'UPDATE categories SET name = ?, slug = ?, description = ?, image_url = ? WHERE id = ?',
      [name || existing[0].name, newSlug, description !== undefined ? description : existing[0].description, image_url, id]
    );

    return res.status(200).json({ message: 'Category updated successfully.' });
  } catch (err) {
    console.error('updateCategory error:', err);
    return res.status(500).json({ message: 'Server error updating category.' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    return res.status(200).json({ message: 'Category deleted successfully.' });
  } catch (err) {
    console.error('deleteCategory error:', err);
    return res.status(500).json({ message: 'Server error deleting category.' });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
