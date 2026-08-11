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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import API from '../../services/api';
import toast from 'react-hot-toast';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    price: '',
    stock: '',
    capacity: '750 ml',
    material: 'Stainless Steel',
    color: 'Matte Black',
    is_featured: false,
    image_url: '',
    amazon_link: '',
    flipkart_link: '',
    external_link: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        API.get('/products?limit=100'),
        API.get('/categories'),
      ]);
      if (prodRes.data && prodRes.data.products) setProducts(prodRes.data.products);
      if (catRes.data && catRes.data.categories) setCategories(catRes.data.categories);
    } catch (err) {
      toast.error('Failed to load products data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditItem(null);
    setFormData({
      name: '',
      category_id: categories[0]?.id || '',
      description: '',
      price: '',
      stock: '20',
      capacity: '750 ml',
      material: 'Stainless Steel',
      color: 'Matte Black',
      is_featured: false,
      image_url: '',
      amazon_link: '',
      flipkart_link: '',
      external_link: '',
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setOpenModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditItem(product);
    setFormData({
      name: product.name,
      category_id: product.category_id,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      capacity: product.capacity || '750 ml',
      material: product.material || 'Stainless Steel',
      color: product.color || 'Matte Black',
      is_featured: product.is_featured === 1,
      image_url: product.image_url || '',
      amazon_link: product.amazon_link || '',
      flipkart_link: product.flipkart_link || '',
      external_link: product.external_link || '',
    });
    setSelectedFile(null);
    setPreviewUrl(product.image_url || '');
    setOpenModal(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('category_id', formData.category_id);
      payload.append('description', formData.description);
      payload.append('price', formData.price);
      payload.append('stock', formData.stock);
      payload.append('capacity', formData.capacity);
      payload.append('material', formData.material);
      payload.append('color', formData.color);
      payload.append('is_featured', formData.is_featured ? '1' : '0');
      payload.append('amazon_link', formData.amazon_link || '');
      payload.append('flipkart_link', formData.flipkart_link || '');
      payload.append('external_link', formData.external_link || '');

      if (selectedFile) {
        payload.append('image', selectedFile);
      } else if (formData.image_url) {
        payload.append('image_url', formData.image_url);
      }

      if (editItem) {
        await API.put(`/products/${editItem.id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated successfully!');
      } else {
        await API.post('/products', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('New bottle added successfully!');
      }

      setOpenModal(false);
      fetchProductsAndCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bottle product?')) {
      try {
        await API.delete(`/products/${id}`);
        toast.success('Product deleted.');
        fetchProductsAndCategories();
      } catch (err) {
        toast.error('Failed to delete product.');
      }
    }
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" className="brand-font" sx={{ fontWeight: 800, color: '#0F4C81' }}>
          Bottle Product Inventory
        </Typography>
        <Button
          variant="contained"
          className="btn-gradient"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
        >
          Add New Bottle
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
                <TableCell sx={{ fontWeight: 700 }}>Bottle</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Capacity / Specs</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Stock</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {products.map((prod) => (
                <TableRow key={prod.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar variant="rounded" src={prod.image_url} sx={{ width: 50, height: 50, bgcolor: '#F1F5F9' }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{prod.name}</Typography>
                        {prod.is_featured === 1 && <Chip label="Featured" size="small" color="primary" sx={{ height: 18, fontSize: '0.68rem' }} />}
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>{prod.category_name || 'Vessel'}</TableCell>

                  <TableCell align="right" sx={{ fontWeight: 800, color: '#0F4C81' }}>
                    ${parseFloat(prod.price).toFixed(2)}
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">{prod.capacity}</Typography>
                    <Typography variant="caption" color="text.secondary">{prod.material}</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={prod.stock}
                      size="small"
                      color={prod.stock < 10 ? 'error' : 'success'}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleOpenEdit(prod)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(prod.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add / Edit Dialog Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#0F4C81' }}>
          {editItem ? 'Edit Bottle Product' : 'Add New Bottle Vessel'}
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Product Title / Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  required
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Price ($)"
                  type="number"
                  inputProps={{ step: '0.01' }}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Stock Inventory"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Capacity (e.g. 750 ml)"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Material (e.g. 18/8 Stainless Steel)"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Color / Finish (e.g. Matte Black)"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Product Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  Upload Image File
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Or Direct Image URL"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </Grid>

              {previewUrl && (
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Box component="img" src={previewUrl} sx={{ height: 120, borderRadius: '8px', objectFit: 'contain' }} />
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F4C81', mt: 1 }}>
                  Also Available On (External Purchase Links)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  If filled, platform icons will be displayed on the product page. Leave empty to hide.
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Amazon Product URL"
                  placeholder="https://amazon.in/dp/..."
                  value={formData.amazon_link}
                  onChange={(e) => setFormData({ ...formData, amazon_link: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Flipkart Product URL"
                  placeholder="https://flipkart.com/p/..."
                  value={formData.flipkart_link}
                  onChange={(e) => setFormData({ ...formData, flipkart_link: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Other Marketplace / Website URL"
                  placeholder="https://..."
                  value={formData.external_link}
                  onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    />
                  }
                  label="Show in Homepage Featured Collection"
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained" className="btn-gradient" disabled={submitting}>
              {submitting ? 'Saving...' : editItem ? 'Update Bottle' : 'Create Bottle'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AdminProductsPage;
