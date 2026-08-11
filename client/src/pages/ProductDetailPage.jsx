import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  Divider,
  Stack,
  IconButton,
  CircularProgress,
  Tab,
  Tabs,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ThermostatOutlinedIcon from '@mui/icons-material/ThermostatOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useCart } from '../context/CartContext';
import API from '../services/api';
import { resolveImageUrl } from '../services/imageUrl';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/${id}`);
        if (res.data && res.data.product) {
          setProduct(res.data.product);
        }
      } catch (err) {
        console.error('Error loading product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 15 }}>
        <CircularProgress sx={{ color: '#00B4D8' }} />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
          Product not found or has been removed.
        </Typography>
        <Button variant="contained" className="btn-gradient" component={Link} to="/products">
          Back to Bottle Catalog
        </Button>
      </Container>
    );
  }

  const handleAddToCart = async () => {
    const res = await addToCart(product, quantity);
    if (res?.requireLogin) {
      navigate('/login');
    }
  };

  const formatExternalUrl = (url) => {
    if (!url) return '';
    const trimmed = String(url).trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const amazonUrl = formatExternalUrl(product.amazon_link);
  const flipkartUrl = formatExternalUrl(product.flipkart_link);
  const externalUrl = formatExternalUrl(product.external_link);
  const hasExternalPurchase = Boolean(amazonUrl || flipkartUrl || externalUrl);

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Back Link */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ color: '#64748B', mb: 3, textTransform: 'none' }}
      >
        Back to Catalog
      </Button>

      <Grid container spacing={6}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              bgcolor: '#F8FAFC',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: { xs: 350, md: 500 },
            }}
          >
            <Box
              component="img"
              src={resolveImageUrl(product.image_url)}
              alt={product.name}
              sx={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            />
          </Paper>
        </Grid>

        {/* Product Detail & Actions */}
        <Grid item xs={12} md={6}>
          <Typography variant="caption" sx={{ color: '#00B4D8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
            {product.category_name || 'Vessel'}
          </Typography>

          <Typography variant="h3" className="brand-font" sx={{ fontWeight: 800, color: '#0F4C81', mt: 0.5, mb: 2 }}>
            {product.name}
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: 800, color: '#00B4D8', mb: 3 }}>
            ${parseFloat(product.price).toFixed(2)}
          </Typography>

          {/* Quick Specifications Pills */}
          <Stack direction="row" spacing={1.5} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
            <Chip
              icon={<ThermostatOutlinedIcon style={{ color: '#00B4D8' }} />}
              label={`Capacity: ${product.capacity || '750 ml'}`}
              sx={{ bgcolor: '#E0F2FE', color: '#0F4C81', fontWeight: 700 }}
            />
            <Chip
              label={`Material: ${product.material || '18/8 Steel'}`}
              sx={{ bgcolor: '#F1F5F9', color: '#334155', fontWeight: 600 }}
            />
            <Chip
              label={`Color: ${product.color || 'Standard'}`}
              sx={{ bgcolor: '#F1F5F9', color: '#334155', fontWeight: 600 }}
            />
            <Chip
              icon={<CheckCircleOutlinedIcon style={{ color: '#10B981' }} />}
              label={product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              color={product.stock > 0 ? 'success' : 'error'}
              variant="outlined"
            />
          </Stack>

          <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 4 }}>
            {product.description || 'Triple-insulated pro-grade vessel engineered to keep cold drinks chilled for 24 hours and hot coffee steaming for 12 hours.'}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Quantity Selector & Add to Cart */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #CBD5E1',
                borderRadius: '30px',
                px: 1,
                py: 0.5,
              }}
            >
              <IconButton
                size="small"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ px: 2, fontWeight: 700, minWidth: 30, textAlign: 'center' }}>
                {quantity}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>

            <Button
              variant="contained"
              size="large"
              className="btn-gradient"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              startIcon={<ShoppingBagOutlinedIcon />}
              sx={{ flexGrow: 1, py: 1.6, fontSize: '1.05rem' }}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </Box>

          {/* Also Available On Section */}
          {hasExternalPurchase && (
            <Box sx={{ mb: 4, p: 2.5, bgcolor: '#FFFFFF', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1.5 }}>
                Also Available On
              </Typography>
              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1.5 }}>
                {amazonUrl && (
                  <Button
                    component="a"
                    href={amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    startIcon={
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 900,
                          fontSize: '1rem',
                          color: '#FF9900',
                          fontFamily: 'sans-serif',
                          lineHeight: 1,
                        }}
                      >
                        a
                      </Box>
                    }
                    sx={{
                      borderColor: '#FF9900',
                      color: '#232F3E',
                      fontWeight: 700,
                      borderRadius: '25px',
                      px: 2.5,
                      py: 0.8,
                      bgcolor: '#FFFDF9',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#FF9900',
                        color: '#FFFFFF',
                        borderColor: '#FF9900',
                      },
                    }}
                  >
                    Buy on Amazon
                  </Button>
                )}
                {flipkartUrl && (
                  <Button
                    component="a"
                    href={flipkartUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    startIcon={
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 900,
                          fontSize: '1rem',
                          color: '#2874F0',
                          fontStyle: 'italic',
                          lineHeight: 1,
                        }}
                      >
                        F
                      </Box>
                    }
                    sx={{
                      borderColor: '#2874F0',
                      color: '#172337',
                      fontWeight: 700,
                      borderRadius: '25px',
                      px: 2.5,
                      py: 0.8,
                      bgcolor: '#F5F8FF',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#2874F0',
                        color: '#FFFFFF',
                        borderColor: '#2874F0',
                      },
                    }}
                  >
                    Buy on Flipkart
                  </Button>
                )}
                {externalUrl && (
                  <Button
                    component="a"
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    startIcon={<ShoppingBagOutlinedIcon sx={{ color: '#00B4D8' }} />}
                    sx={{
                      borderColor: '#00B4D8',
                      color: '#0F4C81',
                      fontWeight: 700,
                      borderRadius: '25px',
                      px: 2.5,
                      py: 0.8,
                      bgcolor: '#F0FDF4',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#00B4D8',
                        color: '#FFFFFF',
                        borderColor: '#00B4D8',
                      },
                    }}
                  >
                    Buy Store Link
                  </Button>
                )}
              </Stack>
            </Box>
          )}

          {/* Guarantee Badges */}
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <ShieldOutlinedIcon sx={{ color: '#00B4D8' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F172A' }}>
                    100-Day Spillproof Guarantee
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleOutlinedIcon sx={{ color: '#10B981' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F172A' }}>
                    BPA & Phthalate Free
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;
