const db = require('../config/db');

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const [cartItems] = await db.query(
      `SELECT c.id as cart_id, c.quantity, p.id as product_id, p.name, p.price, p.image_url, p.capacity, p.material, p.stock 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [userId]
    );

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return res.status(200).json({
      cart: cartItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
    });
  } catch (err) {
    console.error('getCart error:', err);
    return res.status(500).json({ message: 'Server error fetching cart.' });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    // Check if product exists & has stock
    const [products] = await db.query('SELECT stock FROM products WHERE id = ?', [product_id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Check if already in cart
    const [existing] = await db.query('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [
      userId,
      product_id,
    ]);

    if (existing.length > 0) {
      const newQty = existing[0].quantity + parseInt(quantity, 10);
      await db.query('UPDATE cart SET quantity = ? WHERE id = ?', [newQty, existing[0].id]);
    } else {
      await db.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [
        userId,
        product_id,
        parseInt(quantity, 10),
      ]);
    }

    return res.status(200).json({ message: 'Item added to cart successfully.' });
  } catch (err) {
    console.error('addToCart error:', err);
    return res.status(500).json({ message: 'Server error adding to cart.' });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // cart_id
    const { quantity } = req.body;

    if (quantity <= 0) {
      await db.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [id, userId]);
      return res.status(200).json({ message: 'Item removed from cart.' });
    }

    await db.query('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [
      quantity,
      id,
      userId,
    ]);
    return res.status(200).json({ message: 'Cart quantity updated.' });
  } catch (err) {
    console.error('updateCartQuantity error:', err);
    return res.status(500).json({ message: 'Server error updating cart quantity.' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await db.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [id, userId]);
    return res.status(200).json({ message: 'Item removed from cart.' });
  } catch (err) {
    console.error('removeFromCart error:', err);
    return res.status(500).json({ message: 'Server error removing item from cart.' });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);
    return res.status(200).json({ message: 'Cart cleared successfully.' });
  } catch (err) {
    console.error('clearCart error:', err);
    return res.status(500).json({ message: 'Server error clearing cart.' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
};
