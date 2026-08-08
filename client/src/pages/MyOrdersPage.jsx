import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  Stack,
  Avatar,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Collapse,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ReplayIcon from '@mui/icons-material/Replay';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';

import API from '../services/api';
import { useCart } from '../context/CartContext';
import { resolveImageUrl } from '../services/imageUrl';
import toast from 'react-hot-toast';

const orderSteps = ['Order Placed', 'Processing & Packed', 'Shipped', 'Delivered'];

const getActiveStep = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending': return 0;
    case 'processing': return 1;
    case 'shipped': return 2;
    case 'delivered': return 3;
    default: return 0;
  }
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered': return { color: '#10B981', bg: '#D1FAE5' };
    case 'shipped': return { color: '#3B82F6', bg: '#DBEAFE' };
    case 'processing': return { color: '#F59E0B', bg: '#FEF3C7' };
    case 'cancelled': return { color: '#EF4444', bg: '#FEE2E2' };
    default: return { color: '#64748B', bg: '#F1F5F9' };
  }
};

// ─── Single Order Card Component ─────────────────────────────
const OrderCard = ({ order, onReorder }) => {
  const [expanded, setExpanded] = useState(false);
  const isCancelled = order.status === 'cancelled';
  const activeStep = getActiveStep(order.status);
  const statusColors = getStatusColor(order.status);

  const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // First item preview for collapsed view
  const firstItem = order.items?.[0];
  const extraCount = (order.items?.length || 1) - 1;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        bgcolor: '#ffffff',
        overflow: 'hidden',
        transition: 'box-shadow 0.25s ease',
        '&:hover': { boxShadow: '0 6px 24px rgba(0,0,0,0.07)' },
      }}
    >
      {/* ── COLLAPSED HEADER (always visible) ─── */}
      <Box
        onClick={() => setExpanded((prev) => !prev)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2.2,
          cursor: 'pointer',
          bgcolor: expanded ? '#F0F9FF' : '#ffffff',
          borderBottom: expanded ? '1px solid #E2E8F0' : 'none',
          transition: 'background 0.2s ease',
          '&:hover': { bgcolor: '#F8FAFC' },
        }}
      >
        {/* Left: Thumbnail + name + status */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
          {/* Product thumbnail */}
          <Avatar
            variant="rounded"
            src={resolveImageUrl(firstItem?.image_url)}
            alt={firstItem?.product_name}
            sx={{ width: 52, height: 52, border: '1px solid #E2E8F0', bgcolor: '#F8FAFC', flexShrink: 0 }}
          />

          {/* Info */}
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A', noWrap: true, lineHeight: 1.3 }}>
              {firstItem?.product_name || 'Bottle Order'}
              {extraCount > 0 && (
                <Typography component="span" variant="caption" sx={{ ml: 1, color: '#64748B' }}>
                  +{extraCount} more item{extraCount > 1 ? 's' : ''}
                </Typography>
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Ordered on {orderDate} &nbsp;•&nbsp; #{order.id}
            </Typography>
          </Box>
        </Stack>

        {/* Center: Status badge */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', mx: 3 }}>
          <Chip
            label={isCancelled ? 'Cancelled' : order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              bgcolor: statusColors.bg,
              color: statusColors.color,
              border: `1px solid ${statusColors.color}30`,
            }}
          />
        </Box>

        {/* Right: Total + expand icon */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flexShrink: 0 }}>
          <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="caption" color="text.secondary">Total</Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F4C81' }}>
              ₹{parseFloat(order.total_amount).toFixed(2)}
            </Typography>
          </Box>
          <IconButton size="small" sx={{ color: '#64748B' }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Stack>
      </Box>

      {/* ── EXPANDED DETAILS (collapsible) ─── */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 3 }}>

          {/* Shipping Status Tracker */}
          <Box sx={{ mb: 3.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F4C81', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShippingOutlinedIcon sx={{ color: '#00B4D8', fontSize: 20 }} />
              Shipment Tracking
            </Typography>

            {isCancelled ? (
              <Chip label="❌ Order Cancelled" color="error" sx={{ fontWeight: 700 }} />
            ) : (
              <Stepper activeStep={activeStep} alternativeLabel>
                {orderSteps.map((label, index) => (
                  <Step key={label} completed={activeStep > index}>
                    <StepLabel
                      StepIconProps={{
                        sx: { color: activeStep >= index ? '#00B4D8' : '#CBD5E1' },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: activeStep === index ? 800 : 500,
                          color: activeStep === index ? '#0F4C81' : '#94A3B8',
                        }}
                      >
                        {label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Items + Address row */}
          <Grid container spacing={3}>
            {/* Items list */}
            <Grid item xs={12} md={7}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F4C81', mb: 2 }}>
                Items in This Order
              </Typography>
              <Stack spacing={1.5}>
                {(order.items || []).map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.5,
                      bgcolor: '#F8FAFC',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        variant="rounded"
                        src={resolveImageUrl(item.image_url)}
                        alt={item.product_name}
                        sx={{ width: 46, height: 46, bgcolor: '#fff', border: '1px solid #E2E8F0' }}
                      />
                      <Box>
                        <Typography
                          component={Link}
                          to={`/products/${item.product_id}`}
                          variant="body2"
                          sx={{ fontWeight: 700, color: '#0F172A', textDecoration: 'none', '&:hover': { color: '#00B4D8' } }}
                        >
                          {item.product_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Qty: {item.quantity} &nbsp;•&nbsp; {item.capacity || '750 ml'}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#0F4C81', whiteSpace: 'nowrap' }}>
                      ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Address + Actions */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', mb: 2 }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#0F4C81', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnOutlinedIcon sx={{ color: '#00B4D8', fontSize: 18 }} />
                  Delivery Address
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.65, color: '#475569' }}>
                  {order.shipping_address}
                </Typography>
              </Paper>

              {/* Payment badge */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">Payment</Typography>
                <Chip
                  label={order.payment_status?.toUpperCase() || 'PAID'}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    bgcolor: order.payment_status === 'paid' ? '#D1FAE5' : '#DBEAFE',
                    color: order.payment_status === 'paid' ? '#059669' : '#2563EB',
                  }}
                />
              </Box>

              {/* Buy Again button */}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ReplayIcon />}
                onClick={() => onReorder(order)}
                sx={{
                  borderRadius: '12px',
                  borderColor: '#00B4D8',
                  color: '#00B4D8',
                  fontWeight: 700,
                  '&:hover': { bgcolor: '#E0F2FE', borderColor: '#00B4D8' },
                }}
              >
                Buy Again
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

// ─── Main MyOrdersPage ────────────────────────────────────────
const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get('/orders/my-orders');
      if (res.data && res.data.orders) setOrders(res.data.orders);
    } catch (err) {
      toast.error('Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReorder = async (order) => {
    for (const item of order.items || []) {
      await addToCart(
        {
          id: item.product_id,
          name: item.product_name || item.name,
          price: item.price,
          image_url: item.image_url,
          capacity: item.capacity,
          material: item.material,
        },
        item.quantity || 1
      );
    }
    toast.success('Items added back to your cart!');
    navigate('/cart');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress sx={{ color: '#00B4D8' }} />
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Paper elevation={0} sx={{ p: 6, borderRadius: '24px', border: '1px solid #E2E8F0' }}>
          <Inventory2OutlinedIcon sx={{ fontSize: 72, color: '#CBD5E1', mb: 2 }} />
          <Typography variant="h4" className="brand-font" sx={{ fontWeight: 800, color: '#0F4C81', mb: 1 }}>
            No Orders Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Explore our eco-luxury bottle collection and place your first order.
          </Typography>
          <Button component={Link} to="/products" className="btn-gradient" size="large" sx={{ px: 4, py: 1.4, borderRadius: '30px' }}>
            Shop Bottles
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" className="brand-font" sx={{ fontWeight: 800, color: '#0F4C81' }}>
            My Orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {orders.length} order{orders.length !== 1 ? 's' : ''} • Click any order to view full details & tracking
          </Typography>
        </Box>
        <Chip
          icon={<LocalMallOutlinedIcon style={{ color: '#00B4D8', fontSize: 18 }} />}
          label={`${orders.length} Total`}
          sx={{ bgcolor: '#E0F2FE', color: '#0F4C81', fontWeight: 700 }}
        />
      </Box>

      {/* Orders Stack */}
      <Stack spacing={2}>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onReorder={handleReorder} />
        ))}
      </Stack>
    </Container>
  );
};

export default MyOrdersPage;
