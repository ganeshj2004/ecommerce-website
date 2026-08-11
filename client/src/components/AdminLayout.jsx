import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LogoutIcon from '@mui/icons-material/Logout';
import BrandLogo from './BrandLogo';

import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const drawerWidth = 260;

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Products Management', icon: <Inventory2Icon />, path: '/admin/products' },
    { text: 'Categories', icon: <CategoryIcon />, path: '/admin/categories' },
    { text: 'Orders Management', icon: <ShoppingCartIcon />, path: '/admin/orders' },
    { text: 'User Accounts', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Website Content', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#0B192C', color: '#94A3B8' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <BrandLogo height={38} />
        <Box>
          <Typography variant="h6" className="brand-font" sx={{ color: '#ffffff', fontWeight: 800, lineHeight: 1.1 }}>
            Admin Panel
          </Typography>
          <Typography variant="caption" sx={{ color: '#00B4D8', fontWeight: 600 }}>
            {settings.company_name}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#1E293B' }} />

      <List sx={{ px: 2, py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'rgba(0, 180, 216, 0.15)' : 'transparent',
                  color: isActive ? '#00B4D8' : '#94A3B8',
                  '&:hover': { backgroundColor: 'rgba(0, 180, 216, 0.1)', color: '#ffffff' },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#00B4D8' : '#64748B', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.92rem' }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: '#1E293B' }} />

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          component={Link}
          to="/"
          startIcon={<StorefrontIcon />}
          sx={{ color: '#94A3B8', textTransform: 'none', justifyContent: 'flex-start', mb: 1, '&:hover': { color: '#00B4D8' } }}
        >
          Back to Store
        </Button>
        <Button
          fullWidth
          onClick={() => {
            logout();
            navigate('/login');
          }}
          startIcon={<LogoutIcon />}
          sx={{ color: '#EF4444', textTransform: 'none', justifyContent: 'flex-start' }}
        >
          Logout Admin
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#ffffff',
          color: '#0F172A',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: '#0F4C81' }}>
            Store Management Center
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button component={Link} to="/" variant="outlined" size="small" startIcon={<StorefrontIcon />} sx={{ borderRadius: '20px', borderColor: '#00B4D8', color: '#00B4D8' }}>
              View Storefront
            </Button>
            <Avatar sx={{ bgcolor: '#00B4D8', width: 34, height: 34, fontSize: '0.9rem' }}>
              {user?.name?.charAt(0) || 'A'}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
