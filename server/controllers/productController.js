const db = require('../config/db');
const path = require('path');

const getProducts = async (req, res) => {
  try {
    const {
      category_id,
      search,
      min_price,
      max_price,
      material,
      capacity,
      is_featured,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    let sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    if (category_id) {
      sql += ' AND p.category_id = ?';
      params.push(category_id);
    }

    if (is_featured !== undefined) {
      sql += ' AND p.is_featured = ?';
      params.push(Number(is_featured));
    }

    if (search) {
      sql += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.material LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (min_price) {
      sql += ' AND p.price >= ?';
      params.push(Number(min_price));
    }

    if (max_price) {
      sql += ' AND p.price <= ?';
      params.push(Number(max_price));
    }

    if (material) {
      sql += ' AND p.material LIKE ?';
      params.push(`%${material}%`);
    }

    if (capacity) {
      sql += ' AND p.capacity LIKE ?';
      params.push(`%${capacity}%`);
    }

    // Counting Total Before Pagination
    const countSql = `SELECT COUNT(*) as total FROM (${sql}) as subquery`;
    const [countResult] = await db.query(countSql, params);
    const totalProducts = countResult[0].total || countResult[0]['COUNT(*)'] || 0;

    // Sorting
    if (sort === 'price_low') {
      sql += ' ORDER BY p.price ASC';
    } else if (sort === 'price_high') {
      sql += ' ORDER BY p.price DESC';
    } else if (sort === 'name') {
      sql += ' ORDER BY p.name ASC';
    } else {
      sql += ' ORDER BY p.created_at DESC';
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    sql += ' LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const [products] = await db.query(sql, params);

    return res.status(200).json({
      products,
      pagination: {
        total: totalProducts,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalProducts / limitNum) || 1,
      },
    });
  } catch (err) {
    console.error('getProducts error:', err);
    return res.status(500).json({ message: 'Server error fetching products.' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ? OR p.slug = ?`,
      [id, id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.status(200).json({ product: products[0] });
  } catch (err) {
    console.error('getProductById error:', err);
    return res.status(500).json({ message: 'Server error fetching product detail.' });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      category_id,
      name,
      description,
      price,
      stock,
      capacity,
      material,
      color,
      is_featured,
    } = req.body;

    if (!category_id || !name || !price) {
      return res.status(400).json({ message: 'Category, Product Name, and Price are required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
    let image_url = req.body.image_url || 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80';

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
      `INSERT INTO products 
       (category_id, name, slug, description, price, stock, capacity, material, color, image_url, is_featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        name,
        slug,
        description || '',
        price,
        stock || 0,
        capacity || '750 ml',
        material || 'Stainless Steel',
        color || 'Matte Black',
        image_url,
        is_featured ? 1 : 0,
      ]
    );

    return res.status(201).json({
      message: 'Product created successfully',
      productId: result.insertId,
    });
  } catch (err) {
    console.error('createProduct error:', err);
    return res.status(500).json({ message: 'Server error creating product.' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      category_id,
      name,
      description,
      price,
      stock,
      capacity,
      material,
      color,
      is_featured,
    } = req.body;

    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
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

    await db.query(
      `UPDATE products 
       SET category_id = ?, name = ?, description = ?, price = ?, stock = ?, 
           capacity = ?, material = ?, color = ?, image_url = ?, is_featured = ? 
       WHERE id = ?`,
      [
        category_id || existing[0].category_id,
        name || existing[0].name,
        description !== undefined ? description : existing[0].description,
        price !== undefined ? price : existing[0].price,
        stock !== undefined ? stock : existing[0].stock,
        capacity || existing[0].capacity,
        material || existing[0].material,
        color || existing[0].color,
        image_url,
        is_featured !== undefined ? (is_featured ? 1 : 0) : existing[0].is_featured,
        id,
      ]
    );

    return res.status(200).json({ message: 'Product updated successfully.' });
  } catch (err) {
    console.error('updateProduct error:', err);
    return res.status(500).json({ message: 'Server error updating product.' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('deleteProduct error:', err);
    return res.status(500).json({ message: 'Server error deleting product.' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
