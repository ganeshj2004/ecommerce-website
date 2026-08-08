const db = require('../config/db');

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shipping_address, items, razorpay_order_id, razorpay_payment_id, total_amount } = req.body;

    let orderItems = items;
    let computedTotal = total_amount;

    // If items not passed directly, grab from DB cart
    if (!orderItems || orderItems.length === 0) {
      const [cartRows] = await db.query(
        `SELECT c.quantity, p.id as product_id, p.price, p.stock 
         FROM cart c JOIN products p ON c.product_id = p.id 
         WHERE c.user_id = ?`,
        [userId]
      );

      if (cartRows.length === 0) {
        return res.status(400).json({ message: 'Cart is empty. Cannot create order.' });
      }

      orderItems = cartRows;
      computedTotal = cartRows.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    if (!shipping_address) {
      return res.status(400).json({ message: 'Shipping address is required.' });
    }

    const paymentStatus = razorpay_payment_id ? 'paid' : 'pending';

    // Insert Order
    const [orderResult] = await db.query(
      `INSERT INTO orders 
       (user_id, total_amount, shipping_address, status, payment_status, razorpay_order_id, razorpay_payment_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        computedTotal,
        shipping_address,
        'pending',
        paymentStatus,
        razorpay_order_id || null,
        razorpay_payment_id || null,
      ]
    );

    const orderId = orderResult.insertId;

    // Insert Order Items and adjust product stock
    for (const item of orderItems) {
      const prodId = item.product_id || item.id;
      const itemPrice = item.price;
      const itemQty = item.quantity;

      await db.query(
        'INSERT INTO order_items (order_id, product_id, price, quantity) VALUES (?, ?, ?, ?)',
        [orderId, prodId, itemPrice, itemQty]
      );

      // Decrement product stock safely
      await db.query('UPDATE products SET stock = CASE WHEN stock >= ? THEN stock - ? ELSE 0 END WHERE id = ?', [
        itemQty,
        itemQty,
        prodId,
      ]);
    }

    // Clear Cart
    await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);

    return res.status(201).json({
      message: 'Order created successfully',
      orderId,
      total_amount: computedTotal,
    });
  } catch (err) {
    console.error('createOrder error:', err);
    return res.status(500).json({ message: 'Server error creating order.' });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    // Fetch items for each order
    for (let order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name as product_name, p.image_url, p.capacity, p.material 
         FROM order_items oi 
         LEFT JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    return res.status(200).json({ orders });
  } catch (err) {
    console.error('getUserOrders error:', err);
    return res.status(500).json({ message: 'Server error fetching user orders.' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let sql = `
      SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id
    `;
    const params = [];

    if (status) {
      sql += ' WHERE o.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY o.created_at DESC';

    const [orders] = await db.query(sql, params);

    for (let order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name as product_name, p.image_url 
         FROM order_items oi 
         LEFT JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    return res.status(200).json({ orders });
  } catch (err) {
    console.error('getAllOrders error:', err);
    return res.status(500).json({ message: 'Server error fetching all orders.' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_status } = req.body;

    const [existing] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const newStatus = status || existing[0].status;
    const newPaymentStatus = payment_status || existing[0].payment_status;

    await db.query('UPDATE orders SET status = ?, payment_status = ? WHERE id = ?', [
      newStatus,
      newPaymentStatus,
      id,
    ]);

    return res.status(200).json({ message: 'Order status updated successfully.' });
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    return res.status(500).json({ message: 'Server error updating order status.' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};
