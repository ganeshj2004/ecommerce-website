import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Divider,
  Stack,
  Avatar,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

const CartPage = () => {
  const { cart, cartSubtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const freeShippingMin = parseFloat(settings.free_shipping_min || 50);
  const shippingFee = cartSubtotal >= freeShippingMin || cartSubtotal === 0 ? 0 : 5.99;
  const grandTotal = cartSubtotal + shippingFee;

  if (cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <Paper elevation={0} sx={{ p: 6, borderRadius: '24px', border: '1px solid #E2E8F0', bgcolor: '#ffffff' }}>
          <ShoppingBagOutlinedIcon sx={{ fontSize: 72, color: '#CBD5E1', mb: 2 }} />
          <Typography variant="h4" className="brand-font" sx={{ fontWeight: 800, color: '#0F4C81', mb: 1 }}>
            Your Cart is Currently Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Explore our collection of eco-friendly, thermal insulated water bottles.
          </Typography>
          <Button component={Link} to="/products" className="btn-gradient" size="large" sx={{ px: 4, py: 1.4 }}>
            Start Shopping Bottles
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Typography variant="h4" className="brand-font" sx={{ fontWeight: 800, color: '#0F4C81', mb: 4 }}>
        Your Shopping Cart ({cart.length} items)
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items List */}
        <Grid item xs={12} lg={8}>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: '1px solid #E2E8F0' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#0F4C81' }}>Product Vessel</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: '#0F4C81' }}>Price</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: '#0F4C81' }}>Quantity</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#0F4C81' }}>Subtotal</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: '#0F4C81' }}>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {cart.map((item) => {
                  const itemId = item.cart_id || item.product_id;
                  return (
                    <TableRow key={itemId}>
                      {/* Product details */}
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            variant="rounded"
                            src={item.image_url || 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&q=80'}
                            alt={item.name}
                            sx={{ width: 64, height: 64, bgcolor: '#F1F5F9' }}
                          />
                          <Box>
                            <Typography
                              component={Link}
                              to={`/products/${item.product_id}`}
                              variant="subtitle1"
                              sx={{ fontWeight: 700, color: '#0F172A', textDecoration: 'none', '&:hover': { color: '#00B4D8' } }}
                            >
                              {item.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {item.capacity || '750 ml'} • {item.material || 'Stainless Steel'}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Price */}
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        ${parseFloat(item.price).toFixed(2)}
                      </TableCell>

                      {/* Quantity control */}
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            border: '1px solid #CBD5E1',
                            borderRadius: '20px',
                            px: 1,
                            py: 0.3,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(itemId, item.quantity - 1)}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ px: 1.5, fontWeight: 700 }}>{item.quantity}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(itemId, item.quantity + 1)}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>

                      {/* Subtotal */}
                      <TableCell align="right" sx={{ fontWeight: 800, color: '#0F4C81' }}>
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </TableCell>

                      {/* Delete */}
                      <TableCell align="center">
                        <IconButton color="error" onClick={() => removeFromCart(itemId)}>
                          <DeleteOutlineIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" component={Link} to="/products" sx={{ borderColor: '#00B4D8', color: '#00B4D8' }}>
              Continue Shopping
            </Button>
            <Button variant="text" color="error" onClick={clearCart}>
              Clear Entire Cart
            </Button>
          </Box>
        </Grid>

        {/* Order Summary Card */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', border: '1px solid #E2E8F0', bgcolor: '#ffffff' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F4C81', mb: 3 }}>
              Order Summary
            </Typography>

            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Items Subtotal</Typography>
                <Typography sx={{ fontWeight: 700 }}>${cartSubtotal.toFixed(2)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Estimated Shipping</Typography>
                <Typography sx={{ fontWeight: 700, color: shippingFee === 0 ? '#10B981' : 'inherit' }}>
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </Typography>
              </Box>

              {cartSubtotal < freeShippingMin && (
                <Typography variant="caption" sx={{ color: '#00B4D8', fontWeight: 600 }}>
                  Add ${(freeShippingMin - cartSubtotal).toFixed(2)} more for FREE shipping!
                </Typography>
              )}
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
                Grand Total
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F4C81' }}>
                ${grandTotal.toFixed(2)}
              </Typography>
            </Box>

            <Button
              fullWidth
              size="large"
              className="btn-gradient"
              onClick={() => navigate('/checkout')}
              endIcon={<ArrowForwardIcon />}
              sx={{ py: 1.6, fontSize: '1.05rem' }}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
