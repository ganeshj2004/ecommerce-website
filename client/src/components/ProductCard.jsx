import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, Chip, Stack } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ThermostatOutlinedIcon from '@mui/icons-material/ThermostatOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { useCart } from '../context/CartContext';
import { resolveImageUrl } from '../services/imageUrl';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await addToCart(product, 1);
    if (res?.requireLogin) {
      navigate('/login');
    }
  };

  return (
    <Card className="product-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box component={Link} to={`/products/${product.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
        <Box className="product-img-wrapper">
          <Box
            component="img"
            src={resolveImageUrl(product.image_url)}
            alt={product.name}
            loading="lazy"
          />

          {/* Badges */}
          <Stack direction="column" spacing={1} sx={{ position: 'absolute', top: 12, left: 12 }}>
            {product.is_featured === 1 && (
              <Chip
                label="Featured"
                size="small"
                sx={{
                  bgcolor: '#0F4C81',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                }}
              />
            )}
            {product.capacity && (
              <Chip
                icon={<ThermostatOutlinedIcon style={{ fontSize: 14, color: '#00B4D8' }} />}
                label={product.capacity}
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(4px)',
                  color: '#0F172A',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
            )}
          </Stack>
        </Box>

        <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ color: '#00B4D8', fontWeight: 700, textTransform: 'uppercase', mb: 0.5 }}>
            {product.category_name || 'Hydration Vessel'}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1.05rem',
              lineHeight: 1.3,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.name}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', mb: 2 }}>
            {product.material || 'Pro-grade Stainless Steel'} • {product.color || 'Matte Finish'}
          </Typography>

          <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F4C81' }}>
              ${parseFloat(product.price).toFixed(2)}
            </Typography>

            <Button
              variant="contained"
              size="small"
              onClick={handleQuickAdd}
              disabled={product.stock <= 0}
              className="btn-gradient"
              startIcon={<ShoppingBagOutlinedIcon />}
              sx={{ px: 2, py: 0.8, fontSize: '0.82rem' }}
            >
              {product.stock <= 0 ? 'Out of Stock' : 'Add'}
            </Button>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default ProductCard;
