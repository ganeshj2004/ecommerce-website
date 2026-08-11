import React from 'react';
import { Container, Typography, Box, Grid, Paper, Avatar, Divider, Stack } from '@mui/material';
import BrandLogo from '../components/BrandLogo';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';
import EnergySavingsLeafOutlinedIcon from '@mui/icons-material/EnergySavingsLeafOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

import { useSettings } from '../context/SettingsContext';

const AboutPage = () => {
  const { settings } = useSettings();

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Header Banner */}
      <Paper
        sx={{
          background: 'linear-gradient(135deg, #0F4C81 0%, #0B192C 100%)',
          color: '#ffffff',
          borderRadius: '24px',
          p: { xs: 4, md: 8 },
          mb: 8,
          textAlign: 'center',
        }}
      >
        <BrandLogo height={64} sx={{ mx: 'auto', mb: 2 }} />
        <Typography variant="h3" className="brand-font" sx={{ fontWeight: 800, mb: 2 }}>
          About {settings.company_name}
        </Typography>
        <Typography variant="h6" sx={{ color: '#00B4D8', fontWeight: 600, maxWidth: '700px', mx: 'auto', mb: 1 }}>
          {settings.company_tagline}
        </Typography>
      </Paper>

      {/* Main Content Grid */}
      <Grid container spacing={6} alignItems="center" sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="caption" sx={{ color: '#00B4D8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
            Our Craft Philosophy
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F4C81', mt: 1, mb: 3 }}>
            Engineered For Pure Taste & Extreme Preservations
          </Typography>
          <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, fontSize: '1.05rem', mb: 3 }}>
            {settings.about_us}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.7 }}>
            Every bottle crafted by {settings.company_name} undergoes rigorous thermal vacuum retention testing and leak-pressure validations. We select only food-grade pro 18/8 stainless steel and shatter-resistant borosilicate glass so your drinks taste 100% natural, free of metallic or plastic residue.
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&q=80"
            alt="AquaCraft Craftsmen"
            sx={{ width: '100%', borderRadius: '20px', boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }}
          />
        </Grid>
      </Grid>

      {/* Pillars */}
      <Grid container spacing={3} sx={{ mb: 8 }}>
        {[
          {
            icon: <EnergySavingsLeafOutlinedIcon sx={{ fontSize: 40, color: '#00B4D8' }} />,
            title: 'Sustainable Innovation',
            desc: 'Eliminating toxic single-use plastic through lifetime durable materials.',
          },
          {
            icon: <ShieldOutlinedIcon sx={{ fontSize: 40, color: '#00B4D8' }} />,
            title: 'Unrivaled Quality',
            desc: 'Pro-grade 18/8 steel, sweat-free powder finish, and BPA-free silicone seals.',
          },
          {
            icon: <EmojiObjectsOutlinedIcon sx={{ fontSize: 40, color: '#00B4D8' }} />,
            title: 'Smart UV Sanitation',
            desc: 'Integrating deep UV-C LED technology into water caps for active purification.',
          },
        ].map((pillar, idx) => (
          <Grid item xs={12} md={4} key={idx}>
            <Paper className="glass-card" sx={{ p: 4, height: '100%', textAlign: 'center' }}>
              <Box sx={{ mb: 2 }}>{pillar.icon}</Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0F4C81' }}>
                {pillar.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {pillar.desc}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Contact Card */}
      <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: '20px', bgcolor: '#ffffff', border: '1px solid #E2E8F0' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F4C81', mb: 3 }}>
          Get In Touch With Our Team
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'rgba(0, 180, 216, 0.1)', color: '#00B4D8' }}>
                <PhoneOutlinedIcon />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">Phone Line</Typography>
                {settings.phone ? (
                  <Typography
                    component="a"
                    href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      color: '#0F4C81',
                      textDecoration: 'none',
                      display: 'block',
                      '&:hover': { color: '#00B4D8', textDecoration: 'underline' },
                    }}
                  >
                    {settings.phone}
                  </Typography>
                ) : (
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>—</Typography>
                )}
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'rgba(0, 180, 216, 0.1)', color: '#00B4D8' }}>
                <EmailOutlinedIcon />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">Email Support</Typography>
                {settings.email ? (
                  <Typography
                    component="a"
                    href={`mailto:${settings.email.trim()}`}
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      color: '#0F4C81',
                      textDecoration: 'none',
                      display: 'block',
                      '&:hover': { color: '#00B4D8', textDecoration: 'underline' },
                    }}
                  >
                    {settings.email}
                  </Typography>
                ) : (
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>—</Typography>
                )}
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'rgba(0, 180, 216, 0.1)', color: '#00B4D8' }}>
                <LocationOnOutlinedIcon />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">Headquarters</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{settings.address}</Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AboutPage;
