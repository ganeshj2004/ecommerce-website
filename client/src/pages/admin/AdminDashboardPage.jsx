import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  CircularProgress,
  Stack,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

import API from '../../services/api';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get('/analytics');
        if (res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Fetch analytics error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#00B4D8' }} />
      </Box>
    );
  }

  const { summary, lowStockProducts, recentOrders, chartData } = data || {};

  const statCards = [
    {
      title: 'Total Sales Revenue',
      value: `$${summary?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: <AttachMoneyIcon sx={{ fontSize: 32, color: '#10B981' }} />,
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      title: 'Total Orders',
      value: summary?.totalOrders || 0,
      icon: <ShoppingBagIcon sx={{ fontSize: 32, color: '#00B4D8' }} />,
      bgColor: 'rgba(0, 180, 216, 0.1)',
    },
    {
      title: 'Active Customers',
      value: summary?.totalUsers || 0,
      icon: <PeopleAltIcon sx={{ fontSize: 32, color: '#8B5CF6' }} />,
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
    {
      title: 'Catalog Products',
      value: summary?.totalProducts || 0,
      icon: <InventoryIcon sx={{ fontSize: 32, color: '#F59E0B' }} />,
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
  ];

  return (
    <Box sx={{ pb: 6 }}>
      <Typography variant="h4" className="brand-font" sx={{ fontWeight: 800, color: '#0F4C81', mb: 3 }}>
        Analytics Dashboard
      </Typography>

      {/* Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #E2E8F0', bgcolor: '#ffffff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {card.title}
                </Typography>
                <Avatar sx={{ bgcolor: card.bgColor, width: 48, height: 48 }}>{card.icon}</Avatar>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
                {card.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Revenue Trend Chart */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #E2E8F0', bgcolor: '#ffffff', mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F4C81', mb: 3 }}>
          Sales Revenue & Order Volume ($)
        </Typography>

        <Box sx={{ height: 320, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData || []}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B4D8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00B4D8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#00B4D8" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Tables: Low Stock & Recent Orders */}
      <Grid container spacing={4}>
        {/* Low Stock Alerts */}
        <Grid item xs={12} lg={5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #E2E8F0', bgcolor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <WarningAmberIcon sx={{ color: '#EF4444' }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F4C81' }}>
                Low Stock Bottle Alerts
              </Typography>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Bottle Name</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Capacity</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Stock Left</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStockProducts?.map((prod) => (
                    <TableRow key={prod.id}>
                      <TableCell sx={{ fontWeight: 600 }}>{prod.name}</TableCell>
                      <TableCell align="center">{prod.capacity}</TableCell>
                      <TableCell align="right">
                        <Chip label={`${prod.stock} left`} size="small" color="error" />
                      </TableCell>
                    </TableRow>
                  ))}
                  {lowStockProducts?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">All bottle inventory is healthy.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} lg={7}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #E2E8F0', bgcolor: '#ffffff' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F4C81', mb: 2 }}>
              Recent Customer Orders
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Amount</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell sx={{ fontWeight: 700 }}>#{order.id}</TableCell>
                      <TableCell>{order.customer_name || 'Guest'}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: '#0F4C81' }}>
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={order.status.toUpperCase()}
                          size="small"
                          color={
                            order.status === 'delivered'
                              ? 'success'
                              : order.status === 'pending'
                              ? 'warning'
                              : 'primary'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardPage;
