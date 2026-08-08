import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import API from '../../services/api';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/users');
      if (res.data && res.data.users) {
        setUsers(res.data.users);
      }
    } catch (err) {
      toast.error('Failed to load user accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/users/${userId}`, { role: newRole });
      toast.success(`User role updated to ${newRole}.`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update role.');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Delete this user account?')) {
      try {
        await API.delete(`/users/${userId}`);
        toast.success('User account deleted.');
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Typography variant="h4" className="brand-font" sx={{ fontWeight: 800, color: '#0F4C81', mb: 3 }}>
        User Accounts Management
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#00B4D8' }} />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: '1px solid #E2E8F0' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((usr) => (
                <TableRow key={usr.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: '#00B4D8', width: 36, height: 36 }}>{usr.name.charAt(0)}</Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{usr.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{usr.email}</TableCell>
                  <TableCell>{usr.phone || 'N/A'}</TableCell>
                  <TableCell align="center">
                    <Select
                      size="small"
                      value={usr.role}
                      onChange={(e) => handleRoleChange(usr.id, e.target.value)}
                      sx={{ borderRadius: '12px', fontSize: '0.82rem', fontWeight: 700 }}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => handleDelete(usr.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminUsersPage;
