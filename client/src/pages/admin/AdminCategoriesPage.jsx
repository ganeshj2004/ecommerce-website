import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import API from '../../services/api';
import toast from 'react-hot-toast';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image_url: '' });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get('/categories');
      if (res.data && res.data.categories) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      toast.error('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditCategory(null);
    setFormData({ name: '', description: '', image_url: '' });
    setOpenModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '', image_url: cat.image_url || '' });
    setOpenModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCategory) {
        await API.put(`/categories/${editCategory.id}`, formData);
        toast.success('Category updated.');
      } else {
        await API.post('/categories', formData);
        toast.success('Category created.');
      }
      setOpenModal(false);
      fetchCategories();
    } catch (err) {
      toast.error('Error saving category.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await API.delete(`/categories/${id}`);
        toast.success('Category deleted.');
        fetchCategories();
      } catch (err) {
        toast.error('Failed to delete category.');
      }
    }
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" className="brand-font" sx={{ fontWeight: 800, color: '#0F4C81' }}>
          Categories Management
        </Typography>
        <Button variant="contained" className="btn-gradient" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          Add Category
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#00B4D8' }} />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: '1px solid #E2E8F0' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Slug</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Product Count</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar variant="rounded" src={cat.image_url} sx={{ width: 44, height: 44, bgcolor: '#F1F5F9' }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{cat.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{cat.slug}</TableCell>
                  <TableCell>{cat.description}</TableCell>
                  <TableCell align="center">{cat.product_count || 0}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleOpenEdit(cat)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(cat.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#0F4C81' }}>
          {editCategory ? 'Edit Category' : 'Create Category'}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField fullWidth label="Category Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required sx={{ mb: 2 }} />
            <TextField fullWidth multiline rows={2} label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Image URL" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained" className="btn-gradient">Save</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AdminCategoriesPage;
