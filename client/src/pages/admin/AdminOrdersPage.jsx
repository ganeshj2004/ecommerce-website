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
  Select,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Avatar,
  CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import API from '../../services/api';
import toast from 'react-hot-toast';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get('/orders/all');
      if (res.data && res.data.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      toast.error('Failed to load customer orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/status/${orderId}`, { status: newStatus });
      toast.success(`Order #${orderId} status updated to ${newStatus}.`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      await API.put(`/orders/status/${orderId}`, { payment_status: newPaymentStatus });
      toast.success(`Order #${orderId} payment status updated.`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update payment status.');
    }
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Typography variant="h4" className="brand-font" sx={{ fontWeight: 800, color: '#0F4C81', mb: 3 }}>
        Customer Orders Management
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
                <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer Info</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Total Amount</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Order Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Payment Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>View Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((ord) => (
                <TableRow key={ord.id}>
                  <TableCell sx={{ fontWeight: 800 }}>#{ord.id}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{ord.customer_name || 'Customer'}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">{ord.customer_email}</Typography>
                    <Typography variant="caption" color="text.secondary">{ord.customer_phone}</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: '#0F4C81' }}>
                    ${parseFloat(ord.total_amount).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <Select
                      size="small"
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                      sx={{ borderRadius: '12px', fontSize: '0.82rem', fontWeight: 700 }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="processing">Processing</MenuItem>
                      <MenuItem value="shipped">Shipped</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="center">
                    <Select
                      size="small"
                      value={ord.payment_status}
                      onChange={(e) => handlePaymentStatusChange(ord.id, e.target.value)}
                      sx={{ borderRadius: '12px', fontSize: '0.82rem', fontWeight: 700 }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                      <MenuItem value="failed">Failed</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => setSelectedOrder(ord)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Order Item Details Modal */}
      <Dialog open={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#0F4C81' }}>
          Order #{selectedOrder?.id} Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Shipping Address:</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {selectedOrder.shipping_address}
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Ordered Bottle Items:</Typography>
              <Stack spacing={1.5}>
                {selectedOrder.items?.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar variant="rounded" src={item.image_url} sx={{ width: 40, height: 40, bgcolor: '#F1F5F9' }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.product_name}</Typography>
                        <Typography variant="caption" color="text.secondary">Qty: {item.quantity} x ${parseFloat(item.price).toFixed(2)}</Typography>
                      </Box>
                    </Stack>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedOrder(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminOrdersPage;
