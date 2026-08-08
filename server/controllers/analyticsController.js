const db = require('../config/db');

const getAnalytics = async (req, res) => {
  try {
    // 1. Total Revenue
    const [revResult] = await db.query("SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'paid' OR status != 'cancelled'");
    const rawRevenue = revResult[0]?.total || 0;
    const totalRevenue = Number(rawRevenue) || 0;

    // 2. Total Orders
    const [orderResult] = await db.query('SELECT COUNT(*) as total FROM orders');
    const totalOrders = orderResult[0]?.total || orderResult[0]?.['COUNT(*)'] || 0;

    // 3. Total Users
    const [userResult] = await db.query("SELECT COUNT(*) as total FROM users WHERE role = 'user'");
    const totalUsers = userResult[0]?.total || userResult[0]?.['COUNT(*)'] || 0;

    // 4. Products & Low Stock Count (stock < 10)
    const [prodResult] = await db.query('SELECT COUNT(*) as total FROM products');
    const totalProducts = prodResult[0]?.total || prodResult[0]?.['COUNT(*)'] || 0;

    const [lowStockResult] = await db.query('SELECT * FROM products WHERE stock < 10 ORDER BY stock ASC LIMIT 5');

    // 5. Recent Orders
    const [recentOrders] = await db.query(
      `SELECT o.*, u.name as customer_name 
       FROM orders o LEFT JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC LIMIT 5`
    );

    // 6. Chart Data: Monthly Revenue Summary (mock format or aggregate)
    const chartData = [
      { month: 'Jan', revenue: 1200, orders: 24 },
      { month: 'Feb', revenue: 1850, orders: 36 },
      { month: 'Mar', revenue: 2400, orders: 48 },
      { month: 'Apr', revenue: 3100, orders: 62 },
      { month: 'May', revenue: 2900, orders: 55 },
      { month: 'Jun', revenue: 4200, orders: 84 },
      { month: 'Jul', revenue: 5100, orders: 98 },
    ];

    return res.status(200).json({
      summary: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        totalUsers,
        totalProducts,
      },
      lowStockProducts: lowStockResult,
      recentOrders,
      chartData,
    });
  } catch (err) {
    console.error('getAnalytics error:', err);
    return res.status(500).json({ message: 'Server error fetching analytics.' });
  }
};

module.exports = {
  getAnalytics,
};
