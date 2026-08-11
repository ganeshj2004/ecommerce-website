import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip,
  CircularProgress,
  Paper,
} from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import RecyclingOutlinedIcon from '@mui/icons-material/RecyclingOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BrandLogo from '../components/BrandLogo';

import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/ProductCard';
import API from '../services/api';

const HomePage = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          API.get('/products?is_featured=1&limit=6'),
          API.get('/categories'),
        ]);

        if (prodRes.data && prodRes.data.products) {
          setFeaturedProducts(prodRes.data.products);
        }
        if (catRes.data && catRes.data.categories) {
          setCategories(catRes.data.categories);
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      {/* 1. Hero Section */}
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0F4C81 0%, #0B192C 100%)',
          color: '#ffffff',
          py: { xs: 5, md: 12 },
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* Background glow effects */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,180,216,0.2) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                icon={<BrandLogo height={18} />}
                label="Premium Sustainable Hydration"
                sx={{
                  bgcolor: 'rgba(0, 180, 216, 0.15)',
                  color: '#00B4D8',
                  fontWeight: 700,
                  mb: 2,
                  px: 1,
                  py: 2,
                  fontSize: { xs: '0.78rem', sm: '0.9rem' },
                }}
              />
              <Typography
                className="brand-font"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.65rem', sm: '2.8rem', md: '3.8rem' },
                  lineHeight: 1.15,
                  mb: 2,
                  wordBreak: 'break-word',
                }}
              >
                {settings.hero_title || 'Elevate Your Hydration with Eco-Luxury Bottles'}
              </Typography>

              <Typography
                sx={{
                  color: '#94A3B8',
                  fontWeight: 400,
                  fontSize: { xs: '0.95rem', md: '1.15rem' },
                  lineHeight: 1.6,
                  mb: 3,
                  maxWidth: '560px',
                }}
              >
                {settings.hero_subtitle ||
                  '100% BPA-Free vacuum insulated thermo flasks & eco borosilicate glass bottles designed for peak performance.'}
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  component={Link}
                  to="/products"
                  className="btn-gradient"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ px: 4, py: 1.5, fontSize: '1rem', width: { xs: '100%', sm: 'auto' } }}
                >
                  Explore Collection
                </Button>
                <Button
                  component={Link}
                  to="/about"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: '#ffffff',
                    borderRadius: '30px',
                    px: 3.5,
                    fontSize: '0.95rem',
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': { borderColor: '#00B4D8', color: '#00B4D8', bgcolor: 'rgba(0, 180, 216, 0.1)' },
                  }}
                >
                  Our Sustainability Story
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box
                  component="img"
                  src={
                    settings.hero_banner ||
                    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&q=80'
                  }
                  alt="AquaCraft Hero Bottle"
                  sx={{
                    width: '100%',
                    maxHeight: { xs: '260px', sm: '380px', md: '480px' },
                    objectFit: 'cover',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. Features / Value Propositions */}
      <Container maxWidth="xl" sx={{ mt: { xs: 4, md: -4 }, position: 'relative', zIndex: 2, px: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={2}>
          {[
            {
              icon: <AcUnitOutlinedIcon sx={{ fontSize: 32, color: '#00B4D8' }} />,
              title: '24h Cold / 12h Hot',
              desc: 'Double-wall vacuum insulation seals temperature locks for extreme weather conditions.',
            },
            {
              icon: <RecyclingOutlinedIcon sx={{ fontSize: 32, color: '#00B4D8' }} />,
              title: '100% Eco BPA-Free',
              desc: 'Toxin-free, food-grade 18/8 stainless steel and borosilicate glass materials.',
            },
            {
              icon: <LocalShippingOutlinedIcon sx={{ fontSize: 32, color: '#00B4D8' }} />,
              title: `Free Shipping Over $${settings.free_shipping_min || 50}`,
              desc: 'Enjoy rapid climate-neutral delivery on all qualified orders nationwide.',
            },
            {
              icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 32, color: '#00B4D8' }} />,
              title: 'Lifetime Leak Guarantee',
              desc: 'Precision silicone gasket seal ensures 100% spill-proof protection anywhere.',
            },
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Paper
                className="glass-card"
                sx={{
                  p: 2.5,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  bgcolor: '#ffffff',
                }}
              >
                <Box sx={{ mb: 1 }}>{item.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 0.8 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 3. Shop by Category */}
      <Container maxWidth="xl" sx={{ mt: { xs: 6, md: 10 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography variant="caption" sx={{ color: '#00B4D8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
            Vessel Collections
          </Typography>
          <Typography className="brand-font" sx={{ fontSize: { xs: '1.5rem', sm: '2.2rem', md: '2.5rem' }, fontWeight: 800, color: '#0F4C81', mt: 0.5 }}>
            Browse By Category
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {categories.map((cat) => (
            <Grid item xs={12} sm={6} md={3} key={cat.id}>
              <Card
                component={Link}
                to={`/products?category_id=${cat.id}`}
                sx={{
                  textDecoration: 'none',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  height: { xs: 220, sm: 260, md: 280 },
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'scale(1.03)', boxShadow: '0 12px 30px rgba(0,180,216,0.25)' },
                }}
              >
                <CardMedia
                  component="img"
                  image={cat.image_url || 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80'}
                  alt={cat.name}
                  sx={{ height: '100%', width: '100%', objectFit: 'cover', display: 'block' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(11,25,44,0.9) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: 2.5,
                    color: '#ffffff',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                    {cat.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#00B4D8', fontWeight: 600 }}>
                    {cat.product_count || 0} Products →
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 4. Featured Products Section */}
      <Container maxWidth="xl" sx={{ mt: { xs: 6, md: 10 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 1.5, mb: 4 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#00B4D8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
              Featured Canteens
            </Typography>
            <Typography className="brand-font" sx={{ fontSize: { xs: '1.5rem', sm: '2.2rem', md: '2.5rem' }, fontWeight: 800, color: '#0F4C81', mt: 0.5 }}>
              Top Selling Bottles
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/products"
            endIcon={<ArrowForwardIcon />}
            sx={{ color: '#00B4D8', fontWeight: 700, textTransform: 'none', fontSize: '0.95rem', px: 0 }}
          >
            View All ({featuredProducts.length}+)
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#00B4D8' }} />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {featuredProducts.map((prod) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={prod.id}>
                <ProductCard product={prod} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* 5. Eco Impact Banner */}
      <Container maxWidth="xl" sx={{ mt: { xs: 6, md: 12 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Paper
          sx={{
            background: 'linear-gradient(135deg, #0F4C81 0%, #00B4D8 100%)',
            color: '#ffffff',
            borderRadius: '24px',
            p: { xs: 3, sm: 6, md: 8 },
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Typography className="brand-font" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.3rem', sm: '1.8rem', md: '2.2rem' } }}>
            Over 500,000 Single-Use Plastic Bottles Prevented
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', mb: 3.5, opacity: 0.9, fontSize: { xs: '0.9rem', md: '1.1rem' } }}>
            By switching to a durable AquaCraft vessel, you save an average of 167 plastic bottles from entering oceans and landfills every year.
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            size="large"
            sx={{
              bgcolor: '#ffffff',
              color: '#0F4C81',
              fontWeight: 800,
              borderRadius: '30px',
              px: 3.5,
              py: 1.4,
              fontSize: { xs: '0.9rem', md: '1rem' },
              '&:hover': { bgcolor: '#F1F5F9' },
            }}
          >
            Join The Hydration Revolution
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;
