import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Button, TextField, Divider, IconButton } from '@mui/material';
import BrandLogo from './BrandLogo';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SendIcon from '@mui/icons-material/Send';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

import { useSettings } from '../context/SettingsContext';

const formatExternalUrl = (url) => {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const Footer = () => {
  const { settings } = useSettings();

  const instagramUrl = formatExternalUrl(settings.social_instagram);
  const twitterUrl = formatExternalUrl(settings.social_twitter);
  const facebookUrl = formatExternalUrl(settings.social_facebook);

  const hasSocialLinks = Boolean(instagramUrl || twitterUrl || facebookUrl);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0B192C',
        color: '#94A3B8',
        pt: { xs: 5, md: 8 },
        pb: 4,
        mt: { xs: 6, md: 10 },
        borderTop: '1px solid #1E293B',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={{ xs: 4, md: 4 }} sx={{ mb: 6 }}>
          {/* Brand Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <BrandLogo height={32} />
              <Typography variant="h5" className="brand-font" sx={{ color: '#ffffff', fontWeight: 800 }}>
                {settings.company_name}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ lineHeight: 1.7, mb: 3, pr: { md: 4 } }}>
              {settings.company_tagline || 'Eco-luxury insulated water bottles and borosilicate glass vessels engineered for peak hydration retention.'}
            </Typography>

            {hasSocialLinks && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {instagramUrl && (
                  <IconButton
                    component="a"
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    sx={{ color: '#00B4D8', bgcolor: '#1E293B', '&:hover': { bgcolor: '#00B4D8', color: '#fff' } }}
                  >
                    <InstagramIcon fontSize="small" />
                  </IconButton>
                )}
                {twitterUrl && (
                  <IconButton
                    component="a"
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    sx={{ color: '#00B4D8', bgcolor: '#1E293B', '&:hover': { bgcolor: '#00B4D8', color: '#fff' } }}
                  >
                    <TwitterIcon fontSize="small" />
                  </IconButton>
                )}
                {facebookUrl && (
                  <IconButton
                    component="a"
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    sx={{ color: '#00B4D8', bgcolor: '#1E293B', '&:hover': { bgcolor: '#00B4D8', color: '#fff' } }}
                  >
                    <FacebookIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            )}
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 700, mb: 2.5 }}>
              Shop Catalog
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography component={Link} to="/products" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#00B4D8' } }}>
                All Bottles
              </Typography>
              <Typography component={Link} to="/products?category_id=1" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#00B4D8' } }}>
                Thermal Insulated
              </Typography>
              <Typography component={Link} to="/products?category_id=2" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#00B4D8' } }}>
                Borosilicate Glass
              </Typography>
              <Typography component={Link} to="/products?category_id=3" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#00B4D8' } }}>
                Smart UV Canteens
              </Typography>
            </Box>
          </Grid>

          {/* Contact Details */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 700, mb: 2.5 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PhoneOutlinedIcon sx={{ color: '#00B4D8', fontSize: 20, flexShrink: 0 }} />
                {settings.phone ? (
                  <Typography
                    component="a"
                    href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                    variant="body2"
                    sx={{
                      color: '#94A3B8',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                      wordBreak: 'break-word',
                      '&:hover': { color: '#00B4D8' },
                    }}
                  >
                    {settings.phone}
                  </Typography>
                ) : (
                  <Typography variant="body2">—</Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmailOutlinedIcon sx={{ color: '#00B4D8', fontSize: 20, flexShrink: 0 }} />
                {settings.email ? (
                  <Typography
                    component="a"
                    href={`mailto:${settings.email.trim()}`}
                    variant="body2"
                    sx={{
                      color: '#94A3B8',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                      wordBreak: 'break-all',
                      '&:hover': { color: '#00B4D8' },
                    }}
                  >
                    {settings.email}
                  </Typography>
                ) : (
                  <Typography variant="body2">—</Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <LocationOnOutlinedIcon sx={{ color: '#00B4D8', fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>{settings.address}</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 700, mb: 2 }}>
              Stay Hydrated & Updated
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Subscribe for exclusive bottle releases and hydration tips.
            </Typography>
            <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Enter your email"
                size="small"
                variant="outlined"
                sx={{
                  bgcolor: '#1E293B',
                  borderRadius: '25px',
                  input: { color: '#fff' },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                }}
              />
              <Button type="submit" className="btn-gradient" sx={{ minWidth: '46px', px: 1.5, borderRadius: '50%' }}>
                <SendIcon fontSize="small" />
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: '#1E293B', mb: 3 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption">
            © {new Date().getFullYear()} {settings.company_name}. All rights reserved. Built with React & Node.js.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography component={Link} to="/about" variant="caption" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#00B4D8' } }}>
              Privacy Policy
            </Typography>
            <Typography component={Link} to="/about" variant="caption" sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#00B4D8' } }}>
              Terms of Service
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
