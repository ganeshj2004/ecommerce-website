import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Alert,
  Divider,
  Stack,
} from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const LoginPage = () => {
  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@aquacraft.com');
    setPassword('admin123');
  };

  const fillDemoUser = () => {
    setEmail('user@aquacraft.com');
    setPassword('user123');
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #E2E8F0', bgcolor: '#ffffff' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: '#00B4D8', width: 50, height: 50, mx: 'auto', mb: 1.5 }}>
            <WaterDropIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" className="brand-font" sx={{ fontWeight: 800, color: '#0F4C81' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your {settings.company_name} account
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
          <Typography variant="caption" display="block">
            <strong>Quick Demo Credentials:</strong>
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
            <Button size="small" variant="outlined" onClick={fillDemoAdmin} sx={{ py: 0, fontSize: '0.72rem' }}>
              Admin Demo
            </Button>
            <Button size="small" variant="outlined" onClick={fillDemoUser} sx={{ py: 0, fontSize: '0.72rem' }}>
              User Demo
            </Button>
          </Stack>
        </Alert>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2.5 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" align="center" color="text.secondary">
            Don't have an account?{' '}
            <Typography component={Link} to="/register" variant="body2" sx={{ color: '#00B4D8', fontWeight: 700, textDecoration: 'none' }}>
              Register Here
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
