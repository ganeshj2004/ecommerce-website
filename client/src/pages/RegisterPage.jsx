import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await register(formData.name, formData.email, formData.password, formData.phone);
    setLoading(false);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #E2E8F0', bgcolor: '#ffffff' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: '#00B4D8', width: 50, height: 50, mx: 'auto', mb: 1.5 }}>
            <WaterDropIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" className="brand-font" sx={{ fontWeight: 800, color: '#0F4C81' }}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join {settings.company_name} Hydration Club
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ mb: 2.5 }}
          />

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mb: 2.5 }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            sx={{ mb: 2.5 }}
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            size="large"
            className="btn-gradient"
            disabled={loading}
            sx={{ py: 1.4, fontSize: '1rem', mb: 3 }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" align="center" color="text.secondary">
            Already have an account?{' '}
            <Typography component={Link} to="/login" variant="body2" sx={{ color: '#00B4D8', fontWeight: 700, textDecoration: 'none' }}>
              Sign In Here
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
