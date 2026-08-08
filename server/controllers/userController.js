const db = require('../config/db');

const getUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, role, phone, created_at FROM users ORDER BY created_at DESC'
    );
    return res.status(200).json({ users });
  } catch (err) {
    console.error('getUsers error:', err);
    return res.status(500).json({ message: 'Server error fetching users.' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, name, phone } = req.body;

    const [existing] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await db.query('UPDATE users SET role = ?, name = ?, phone = ? WHERE id = ?', [
      role || existing[0].role,
      name || existing[0].name,
      phone !== undefined ? phone : existing[0].phone,
      id,
    ]);

    return res.status(200).json({ message: 'User updated successfully.' });
  } catch (err) {
    console.error('updateUser error:', err);
    return res.status(500).json({ message: 'Server error updating user.' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id, 10) === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' });
    }

    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('deleteUser error:', err);
    return res.status(500).json({ message: 'Server error deleting user.' });
  }
};

module.exports = {
  getUsers,
  updateUser,
  deleteUser,
};
