import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Divider,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import API from '../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cart, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [shippingData, setShippingData] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: (user?.phone && !user.phone.includes('800')) ? user.phone : '9876543210',
  });

  // Payment Selection State
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod' | 'razorpay_modal'
  const [upiId, setUpiId] = useState('success@razorpay');
  const [cardDetails, setCardDetails] = useState({
    number: '4012 0000 0000 0001',
    expiry: '12/28',
    cvv: '123',
    name: user?.name || 'Customer Name',
  });
  const [selectedBank, setSelectedBank] = useState('HDFC');

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState(null);

  const freeShippingMin = parseFloat(settings.free_shipping_min || 50);
  const shippingFee = cartSubtotal >= freeShippingMin || cartSubtotal === 0 ? 0 : 5.99;
  const grandTotal = cartSubtotal + shippingFee;

  const handleInputChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleCardInputChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const fillTestCard = () => {
    setCardDetails({
      number: '4012 0000 0000 0001',
      expiry: '12/28',
      cvv: '123',
      name: shippingData.fullName || 'Jane Doe',
    });
    toast.success('Filled Indian Domestic Test Card');
  };

  const fillTestUpi = () => {
    setUpiId('success@razorpay');
    toast.success('Filled Test UPI ID (success@razorpay)');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!shippingData.fullName || !shippingData.address || !shippingData.city || !shippingData.phone) {
      toast.error('Please fill in all required shipping address fields.');
      return;
    }

    setLoading(true);
    const fullShippingAddress = `${shippingData.fullName}, ${shippingData.address}, ${shippingData.city}, ${shippingData.state} ${shippingData.zip}. Contact: ${shippingData.phone}. Payment via ${paymentMethod.toUpperCase()}`;

    // Helper to finalize order record in DB
    const finalizeOrder = async (razorpayOrderId = null, razorpayPaymentId = null) => {
      try {
        const orderRes = await API.post('/orders', {
          shipping_address: fullShippingAddress,
          total_amount: grandTotal,
          razorpay_order_id: razorpayOrderId || `order_app_${Date.now()}`,
          razorpay_payment_id: razorpayPaymentId || `pay_${paymentMethod}_${Date.now()}`,
          items: cart,
        });

        if (orderRes.data && orderRes.data.orderId) {
          setCompletedOrderId(orderRes.data.orderId);
          await clearCart();
          setOrderComplete(true);
          toast.success('Order placed successfully!');
        }
      } catch (orderErr) {
        toast.error('Error placing order in database.');
      } finally {
        setLoading(false);
      }
    };

    // 1. CASH ON DELIVERY
    if (paymentMethod === 'cod') {
      setTimeout(() => {
        finalizeOrder(null, `cod_${Date.now()}`);
      }, 1000);
      return;
    }

    // 2. UPI / CARD / NETBANKING via Razorpay Backend Order API
    try {
      const paymentRes = await API.post('/payment/create-order', {
        amount: grandTotal,
        currency: 'INR',
      });

      const { orderId, key, isTestMode } = paymentRes.data;

      if (window.Razorpay && !isTestMode && paymentMethod === 'razorpay_modal') {
        // Open Official Razorpay Popup Modal
        const options = {
          key: key,
          amount: Math.round(grandTotal * 100),
          currency: 'INR',
          name: settings.company_name,
          description: 'AquaCraft Hydration Order',
          image: settings.company_logo,
          order_id: orderId,
          handler: async function (response) {
            await API.post('/payment/verify-signature', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            finalizeOrder(response.razorpay_order_id, response.razorpay_payment_id);
          },
          prefill: {
            name: shippingData.fullName,
            email: user?.email || 'customer@aquacraft.com',
            contact: (shippingData.phone && /^[6-9]\d{9}$/.test(shippingData.phone.replace(/\D/g, '').slice(-10)))
              ? shippingData.phone.replace(/\D/g, '').slice(-10)
              : '9876543210',
          },
          theme: { color: '#0F4C81' },
          modal: {
            ondismiss: function () {
              setLoading(false);
              toast.error('Payment modal cancelled.');
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Direct Seamless Payment Simulation
        setTimeout(() => {
          finalizeOrder(orderId || `rzp_${paymentMethod}_${Date.now()}`, `pay_${paymentMethod}_${Date.now()}`);
        }, 1200);
      }
    } catch (err) {
      console.error('Payment Error:', err);
      toast.error('Failed to process payment order.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Amazon Style Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1.5, mb: 3.5 }}>
        <Typography className="brand-font" sx={{ fontSize: { xs: '1.35rem', sm: '1.8rem', md: '2.2rem' }, fontWeight: 800, color: '#0F4C81', wordBreak: 'break-word' }}>
          Select Delivery & Payment Method
        </Typography>
        <Chip
          icon={<LockOutlinedIcon style={{ fontSize: 16, color: '#10B981' }} />}
          label="256-Bit SSL Encrypted"
          size="small"
          sx={{ bgcolor: '#E0F2FE', color: '#0F4C81', fontWeight: 700 }}
        />
      </Box>

      <Grid container spacing={{ xs: 3, md: 4 }}>
        {/* Left Column: Step 1 Address + Step 2 Payment Selection */}
        <Grid item xs={12} md={7} lg={8}>
          <Box component="form" onSubmit={handlePlaceOrder}>
            {/* Step 1: Delivery Address */}
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3.5 }, borderRadius: '20px', border: '1px solid #E2E8F0', bgcolor: '#ffffff', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F4C81', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
                <Box component="span" sx={{ bgcolor: '#00B4D8', color: '#fff', width: 28, height: 28, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, flexShrink: 0 }}>
                  1
                </Box>
                Delivery Address
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Full Name *" name="fullName" value={shippingData.fullName} onChange={handleInputChange} required size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="10-Digit Mobile Number *" name="phone" value={shippingData.phone} onChange={handleInputChange} required size="small" placeholder="9876543210" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Flat, House no., Building, Street Name *" name="address" value={shippingData.address} onChange={handleInputChange} required size="small" placeholder="NO 93 B, Gudiyatham Tk" />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField fullWidth label="City / Town *" name="city" value={shippingData.city} onChange={handleInputChange} required size="small" placeholder="Vellore" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="State" name="state" value={shippingData.state} onChange={handleInputChange} size="small" placeholder="Tamil Nadu" />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField fullWidth label="Pincode" name="zip" value={shippingData.zip} onChange={handleInputChange} size="small" placeholder="632001" />
                </Grid>
              </Grid>
            </Paper>

            {/* Step 2: Payment Method (Amazon Radio Cards) */}
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3.5 }, borderRadius: '20px', border: '1px solid #E2E8F0', bgcolor: '#ffffff', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F4C81', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
                <Box component="span" sx={{ bgcolor: '#00B4D8', color: '#fff', width: 28, height: 28, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, flexShrink: 0 }}>
                  2
                </Box>
                Select Payment Method
              </Typography>

              <FormControl component="fieldset" fullWidth>
                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  {/* Option A: UPI / QR */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: { xs: 1.5, sm: 2.5 },
                      mb: 2,
                      borderRadius: '16px',
                      borderColor: paymentMethod === 'upi' ? '#00B4D8' : '#E2E8F0',
                      bgcolor: paymentMethod === 'upi' ? 'rgba(0, 180, 216, 0.04)' : '#ffffff',
                      transition: 'all 0.2s ease',
                      overflow: 'hidden',
                    }}
                  >
                    <FormControlLabel
                      value="upi"
                      control={<Radio sx={{ color: '#00B4D8', '&.Mui-checked': { color: '#00B4D8' } }} />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <QrCodeScannerIcon sx={{ color: '#00B4D8', flexShrink: 0 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                            UPI Apps & QR (Google Pay / PhonePe / Paytm / BHIM)
                          </Typography>
                        </Box>
                      }
                    />

                    {paymentMethod === 'upi' && (
                      <Box sx={{ mt: 2, ml: { xs: 0, sm: 4 }, pt: { xs: 1, sm: 0 } }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.85rem' }}>
                          Enter your UPI Virtual Address (VPA) or click test fill below:
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
                          <TextField
                            size="small"
                            placeholder="username@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            sx={{ bgcolor: '#ffffff', width: { xs: '100%', sm: '280px' } }}
                          />
                          <Button size="small" variant="outlined" onClick={fillTestUpi} sx={{ borderColor: '#00B4D8', color: '#00B4D8', py: 0.8 }}>
                            Fill Test UPI
                          </Button>
                        </Stack>
                      </Box>
                    )}
                  </Paper>

                  {/* Option B: Credit / Debit Cards */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: { xs: 1.5, sm: 2.5 },
                      mb: 2,
                      borderRadius: '16px',
                      borderColor: paymentMethod === 'card' ? '#00B4D8' : '#E2E8F0',
                      bgcolor: paymentMethod === 'card' ? 'rgba(0, 180, 216, 0.04)' : '#ffffff',
                      transition: 'all 0.2s ease',
                      overflow: 'hidden',
                    }}
                  >
                    <FormControlLabel
                      value="card"
                      control={<Radio sx={{ color: '#00B4D8', '&.Mui-checked': { color: '#00B4D8' } }} />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CreditCardIcon sx={{ color: '#00B4D8', flexShrink: 0 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                            Credit / Debit Cards (RuPay, Visa, Mastercard)
                          </Typography>
                        </Box>
                      }
                    />

                    {paymentMethod === 'card' && (
                      <Box sx={{ mt: 2, ml: { xs: 0, sm: 4 } }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1, mb: 1.5 }}>
                          <Typography variant="body2" color="text.secondary">Enter Card Details:</Typography>
                          <Button size="small" variant="outlined" onClick={fillTestCard} sx={{ fontSize: '0.75rem', py: 0.4 }}>
                            Fill Test Indian Card (4012...)
                          </Button>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={7}>
                            <TextField fullWidth size="small" label="Card Number" name="number" value={cardDetails.number} onChange={handleCardInputChange} />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <TextField fullWidth size="small" label="Expiry (MM/YY)" name="expiry" value={cardDetails.expiry} onChange={handleCardInputChange} />
                          </Grid>
                          <Grid item xs={6} sm={2}>
                            <TextField fullWidth size="small" label="CVV" name="cvv" type="password" value={cardDetails.cvv} onChange={handleCardInputChange} />
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Paper>

                  {/* Option C: Net Banking */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: { xs: 1.5, sm: 2.5 },
                      mb: 2,
                      borderRadius: '16px',
                      borderColor: paymentMethod === 'netbanking' ? '#00B4D8' : '#E2E8F0',
                      bgcolor: paymentMethod === 'netbanking' ? 'rgba(0, 180, 216, 0.04)' : '#ffffff',
                      transition: 'all 0.2s ease',
                      overflow: 'hidden',
                    }}
                  >
                    <FormControlLabel
                      value="netbanking"
                      control={<Radio sx={{ color: '#00B4D8', '&.Mui-checked': { color: '#00B4D8' } }} />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccountBalanceIcon sx={{ color: '#00B4D8', flexShrink: 0 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                            Net Banking (SBI, HDFC, ICICI, Axis, Kotak)
                          </Typography>
                        </Box>
                      }
                    />

                    {paymentMethod === 'netbanking' && (
                      <Box sx={{ mt: 2, ml: { xs: 0, sm: 4 } }}>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                          {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak'].map((bank) => (
                            <Chip
                              key={bank}
                              label={bank}
                              clickable
                              color={selectedBank === bank ? 'primary' : 'default'}
                              onClick={() => setSelectedBank(bank)}
                              sx={{ fontWeight: 700 }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Paper>

                  {/* Option D: Cash on Delivery (COD) */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      mb: 2,
                      borderRadius: '16px',
                      borderColor: paymentMethod === 'cod' ? '#00B4D8' : '#E2E8F0',
                      bgcolor: paymentMethod === 'cod' ? 'rgba(0, 180, 216, 0.04)' : '#ffffff',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <FormControlLabel
                      value="cod"
                      control={<Radio sx={{ color: '#00B4D8', '&.Mui-checked': { color: '#00B4D8' } }} />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <LocalAtmIcon sx={{ color: '#10B981' }} />
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                              Cash on Delivery (COD)
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Pay cash when your bottle parcel arrives at your doorstep.
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </Paper>

                  {/* Option E: Razorpay Direct Popup Modal */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      borderRadius: '16px',
                      borderColor: paymentMethod === 'razorpay_modal' ? '#00B4D8' : '#E2E8F0',
                      bgcolor: paymentMethod === 'razorpay_modal' ? 'rgba(0, 180, 216, 0.04)' : '#ffffff',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <FormControlLabel
                      value="razorpay_modal"
                      control={<Radio sx={{ color: '#00B4D8', '&.Mui-checked': { color: '#00B4D8' } }} />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <PaymentIcon sx={{ color: '#00B4D8' }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                            Razorpay Official Popup Modal
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </RadioGroup>
              </FormControl>
            </Paper>

            <Button
              type="submit"
              fullWidth
              size="large"
              className="btn-gradient"
              disabled={loading || cart.length === 0}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
              sx={{ py: 1.8, fontSize: '1.1rem', borderRadius: '30px' }}
            >
              {loading
                ? 'Processing Payment & Order...'
                : paymentMethod === 'cod'
                ? `Place Order (Cash on Delivery $${grandTotal.toFixed(2)})`
                : `Pay $${grandTotal.toFixed(2)} via ${paymentMethod.toUpperCase()}`}
            </Button>
          </Box>
        </Grid>

        {/* Right Column: Step 3 Order Summary */}
        <Grid item xs={12} md={5} lg={4}>
          <Paper elevation={0} sx={{ p: 3.5, borderRadius: '20px', border: '1px solid #E2E8F0', bgcolor: '#ffffff', position: 'sticky', top: 90 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F4C81', mb: 2.5 }}>
              Order Breakdown ({cart.length} items)
            </Typography>

            <Stack spacing={2} sx={{ mb: 3, maxHeight: 260, overflowY: 'auto', pr: 1 }}>
              {cart.map((item) => (
                <Box key={item.cart_id || item.product_id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar variant="rounded" src={item.image_url} sx={{ width: 44, height: 44, bgcolor: '#F1F5F9' }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">Qty: {item.quantity} • {item.capacity || '750 ml'}</Typography>
                    </Box>
                  </Stack>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ mb: 2.5 }} />

            <Stack spacing={1.5} sx={{ mb: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography sx={{ fontWeight: 700 }}>${cartSubtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Shipping Fee</Typography>
                <Typography sx={{ fontWeight: 700, color: shippingFee === 0 ? '#10B981' : 'inherit' }}>
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 2.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Total</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F4C81' }}>
                ${grandTotal.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LocalShippingOutlinedIcon sx={{ color: '#00B4D8' }} />
              <Typography variant="caption" color="text.secondary">
                Delivered in 2-4 business days with 100-day spillproof guarantee.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Order Complete Confirmation Modal */}
      <Dialog open={orderComplete} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: '#10B981' }} />
          <Typography variant="h5" className="brand-font" sx={{ fontWeight: 800, color: '#0F4C81', mt: 1 }}>
            Order Confirmed!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Thank you for shopping at <strong>{settings.company_name}</strong>.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your Order ID is <strong>#{completedOrderId}</strong>. Your bottle parcel is being prepared for rapid dispatch.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 4, gap: 2, flexDirection: 'column' }}>
          <Button
            variant="contained"
            className="btn-gradient"
            onClick={() => {
              setOrderComplete(false);
              navigate('/my-orders');
            }}
            startIcon={<LocalShippingOutlinedIcon />}
            sx={{ px: 4, borderRadius: '30px', width: '80%' }}
          >
            Track My Order
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setOrderComplete(false);
              navigate('/');
            }}
            sx={{ px: 4, borderRadius: '30px', width: '80%' }}
          >
            Return to Homepage
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CheckoutPage;
