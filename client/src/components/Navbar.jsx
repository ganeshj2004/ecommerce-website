import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { resolveImageUrl } from '../services/imageUrl';

const Navbar = () => {
  const { settings } = useSettings();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop Bottles', path: '/products' },
    { label: 'About Us', path: '/about' },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#ffffff',
        color: '#0F172A',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #E2E8F0',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Toolbar disableGutters sx={{ minHeight: { xs: '65px', md: '75px' }, justifyContent: 'space-between', gap: 1 }}>
          {/* Brand Logo & Name */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              gap: { xs: 1, sm: 1.5 },
              maxWidth: { xs: '160px', sm: '280px', md: 'none' },
              overflow: 'hidden',
            }}
          >
            {settings.company_logo ? (
              <Box
                component="img"
                src={resolveImageUrl(settings.company_logo)}
                alt={settings.company_name}
                className="navbar-logo"
                sx={{
                  height: { xs: 34, sm: 42 },
                  maxHeight: { xs: 34, sm: 42 },
                  width: 'auto',
                  maxWidth: { xs: 80, sm: 120 },
                  borderRadius: '8px',
                  objectFit: 'contain',
                  flexShrink: 0,
                  display: 'block',
                }}
              />
            ) : (
              <Avatar sx={{ bgcolor: '#00B4D8', width: { xs: 34, sm: 40 }, height: { xs: 34, sm: 40 }, flexShrink: 0 }}>
                <WaterDropIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Avatar>
            )}
            <Box sx={{ overflow: 'hidden' }}>
              <Typography
                variant="h6"
                className="brand-font"
                noWrap
                sx={{
                  color: '#0F4C81',
                  fontWeight: 800,
                  fontSize: { xs: '1.05rem', sm: '1.25rem', md: '1.4rem' },
                  lineHeight: 1.1,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {settings.company_name}
              </Typography>
              <Typography variant="caption" noWrap sx={{ color: '#00B4D8', fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                {settings.company_tagline || 'Eco-Hydration'}
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: isActive ? '#00B4D8' : '#334155',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.98rem',
                    position: 'relative',
                    '&:hover': { color: '#00B4D8', backgroundColor: 'transparent' },
                    '&::after': isActive
                      ? {
                          content: '""',
                          position: 'absolute',
                          bottom: 4,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '60%',
                          height: '3px',
                          backgroundColor: '#00B4D8',
                          borderRadius: '2px',
                        }
                      : {},
                  }}
                >
                  {link.label}
                </Button>
              );
            })}
          </Box>

          {/* Search Input Bar */}
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              backgroundColor: '#F1F5F9',
              borderRadius: '25px',
              padding: '4px 14px',
              width: '240px',
              transition: 'all 0.3s ease',
              border: '1px solid #E2E8F0',
              '&:focus-within': { width: '300px', borderColor: '#00B4D8', backgroundColor: '#ffffff' },
            }}
          >
            <InputBase
              placeholder="Search bottles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ ml: 1, flex: 1, fontSize: '0.9rem' }}
            />
            <IconButton type="submit" sx={{ p: '6px', color: '#00B4D8' }}>
              <SearchIcon />
            </IconButton>
          </Box>

          {/* Action Icons & Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            {/* Cart Icon */}
            <IconButton
              component={Link}
              to="/cart"
              sx={{
                color: '#0F4C81',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                '&:hover': { backgroundColor: '#E0F2FE', color: '#00B4D8' },
              }}
            >
              <Badge badgeContent={cartCount} color="secondary">
                <ShoppingBagOutlinedIcon />
              </Badge>
            </IconButton>

            {/* Auth Menu / User Profile */}
            {isAuthenticated ? (
              <>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5, border: '2px solid #00B4D8' }}>
                  <Avatar sx={{ bgcolor: '#0F4C81', width: 34, height: 34, fontSize: '0.95rem' }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem disabled sx={{ opacity: '1 !important' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {user?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.email} ({user?.role})
                      </Typography>
                    </Box>
                  </MenuItem>
                  <Divider />
                  {isAdmin && (
                    <MenuItem
                      onClick={() => {
                        handleCloseUserMenu();
                        navigate('/admin');
                      }}
                      sx={{ gap: 1.5, color: '#0F4C81', fontWeight: 600 }}
                    >
                      <DashboardOutlinedIcon fontSize="small" />
                      Admin Dashboard
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate('/my-orders');
                    }}
                    sx={{ gap: 1.5 }}
                  >
                    <ReceiptLongOutlinedIcon fontSize="small" sx={{ color: '#00B4D8' }} />
                    My Orders & Tracking
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate('/cart');
                    }}
                    sx={{ gap: 1.5 }}
                  >
                    <ShoppingCartOutlinedIcon fontSize="small" sx={{ color: '#00B4D8' }} />
                    My Cart
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      logout();
                      navigate('/');
                    }}
                    sx={{ gap: 1.5, color: '#EF4444' }}
                  >
                    <LogoutOutlinedIcon fontSize="small" />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  sx={{
                    borderColor: '#00B4D8',
                    color: '#00B4D8',
                    borderRadius: '20px',
                    px: 2.5,
                    display: { xs: 'none', sm: 'inline-flex' },
                    '&:hover': { borderColor: '#0F4C81', color: '#0F4C81', backgroundColor: '#F0F9FF' },
                  }}
                >
                  Log In
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  className="btn-gradient"
                  sx={{ px: 2.5, fontSize: '0.88rem' }}
                >
                  Sign Up
                </Button>
              </Box>
            )}

            {/* Mobile Drawer Icon */}
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#0F4C81' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: { xs: '82vw', sm: 280 },
            maxWidth: 300,
          },
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar sx={{ bgcolor: '#00B4D8', width: 36, height: 36 }}>
              <WaterDropIcon />
            </Avatar>
            <Typography variant="h6" className="brand-font" sx={{ color: '#0F4C81', fontWeight: 800 }}>
              {settings.company_name}
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <List>
            {navLinks.map((link) => (
              <ListItem
                button
                key={link.path}
                component={Link}
                to={link.path}
                onClick={handleDrawerToggle}
                sx={{ borderRadius: '8px', mb: 0.5 }}
              >
                <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {!isAuthenticated ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                fullWidth
                onClick={handleDrawerToggle}
                sx={{ borderColor: '#00B4D8', color: '#00B4D8', borderRadius: '20px' }}
              >
                Log In
              </Button>
              <Button
                component={Link}
                to="/register"
                fullWidth
                className="btn-gradient"
                onClick={handleDrawerToggle}
              >
                Sign Up
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {isAdmin && (
                <Button
                  component={Link}
                  to="/admin"
                  variant="contained"
                  fullWidth
                  onClick={handleDrawerToggle}
                  sx={{ bgcolor: '#0F4C81' }}
                >
                  Admin Dashboard
                </Button>
              )}
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={() => {
                  handleDrawerToggle();
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
