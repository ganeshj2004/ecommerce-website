import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  Stack,
  Avatar,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { useSettings } from '../../context/SettingsContext';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { resolveImageUrl } from '../../services/imageUrl';

const AdminSettingsPage = () => {
  const { settings, fetchSettings } = useSettings();

  const [formState, setFormState] = useState({ ...settings });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(settings.company_logo || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormState({ ...settings });
    setLogoPreview(resolveImageUrl(settings.company_logo));
  }, [settings]);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleLogoFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(formState).forEach(([key, val]) => {
        payload.append(key, val);
      });

      if (logoFile) {
        payload.append('logo', logoFile);
      }

      await API.post('/settings/update', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchSettings();
      toast.success('Website dynamic content updated successfully!');
    } catch (err) {
      toast.error('Failed to update website content.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Typography variant="h4" className="brand-font" sx={{ fontWeight: 800, color: '#0F4C81', mb: 3 }}>
        Website Content & Branding Control
      </Typography>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', border: '1px solid #E2E8F0', bgcolor: '#ffffff' }}>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Section 1: Brand & Logo */}
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F4C81', mb: 2 }}>
            1. Brand Identity & Logo
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="company_name"
                value={formState.company_name || ''}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Tagline"
                name="company_tagline"
                value={formState.company_tagline || ''}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{ py: 1.5 }}
              >
                Upload Brand Logo File
                <input type="file" hidden accept="image/*" onChange={handleLogoFileChange} />
              </Button>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Or Direct Logo URL"
                name="company_logo"
                value={formState.company_logo || ''}
                onChange={handleChange}
              />
            </Grid>

            {logoPreview && (
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="caption" color="text.secondary">Current Logo Preview:</Typography>
                <Avatar variant="rounded" src={resolveImageUrl(logoPreview)} sx={{ width: 60, height: 60, objectFit: 'contain' }} />
              </Grid>
            )}
          </Grid>

          <Divider sx={{ mb: 4 }} />

          {/* Section 2: Homepage Hero & Banner */}
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F4C81', mb: 2 }}>
            2. Homepage Text & Hero Banner
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Hero Main Headline"
                name="hero_title"
                value={formState.hero_title || ''}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Hero Subtitle / Description"
                name="hero_subtitle"
                value={formState.hero_subtitle || ''}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Hero Banner Image URL"
                name="hero_banner"
                value={formState.hero_banner || ''}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 4 }} />

          {/* Section 3: About Us & Contact Info */}
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F4C81', mb: 2 }}>
            3. About Us & Contact Details
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="About Us Full Text"
                name="about_us"
                value={formState.about_us || ''}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Customer Support Phone"
                name="phone"
                value={formState.phone || ''}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Customer Support Email"
                name="email"
                value={formState.email || ''}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Minimum Amount for Free Shipping ($)"
                name="free_shipping_min"
                type="number"
                value={formState.free_shipping_min || ''}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Physical Address"
                name="address"
                value={formState.address || ''}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              className="btn-gradient"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
            >
              {submitting ? 'Saving Changes...' : 'Save All Dynamic Content'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminSettingsPage;
