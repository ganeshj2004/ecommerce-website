import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Pagination,
  CircularProgress,
  Button,
  Drawer,
  IconButton,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import API from '../services/api';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get('category_id') || '';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [search, setSearch] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [material, setMaterial] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category or search from searchParams URL
  useEffect(() => {
    if (searchParams.get('category_id') !== null) {
      setSelectedCategory(searchParams.get('category_id'));
    }
    if (searchParams.get('search') !== null) {
      setSearch(searchParams.get('search'));
    }
  }, [searchParams]);

  // Fetch Categories once
  useEffect(() => {
    API.get('/categories')
      .then((res) => {
        if (res.data && res.data.categories) {
          setCategories(res.data.categories);
        }
      })
      .catch((err) => console.error('Category fetch error:', err));
  }, []);

  // Fetch Filtered Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category_id', selectedCategory);
      if (search) params.append('search', search);
      if (priceRange[0] > 0) params.append('min_price', priceRange[0]);
      if (priceRange[1] < 100) params.append('max_price', priceRange[1]);
      if (material) params.append('material', material);
      if (sort) params.append('sort', sort);
      params.append('page', page);
      params.append('limit', 8);

      const res = await API.get(`/products?${params.toString()}`);
      if (res.data) {
        setProducts(res.data.products || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, search, priceRange, material, sort, page]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearch('');
    setPriceRange([0, 100]);
    setMaterial('');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Page Title & Count Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2.5, md: 4 } }}>
        <Box>
          <Typography className="brand-font" sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.2rem' }, fontWeight: 800, color: '#0F4C81' }}>
            Bottle Catalog
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Showing {products.length} of {pagination.total} water vessels
          </Typography>
        </Box>

        {/* Mobile Filter Button */}
        <Button
          variant="outlined"
          startIcon={<FilterAltIcon />}
          onClick={() => setMobileFilterOpen(true)}
          sx={{ display: { xs: 'flex', md: 'none' }, borderColor: '#00B4D8', color: '#00B4D8', flexShrink: 0 }}
        >
          Filters
        </Button>
      </Box>

      <Grid container spacing={{ xs: 2, md: 4 }}>
        {/* Desktop Filter Sidebar */}
        <Grid item xs={12} md={3.5} lg={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={(val) => { setSelectedCategory(val); setPage(1); }}
            priceRange={priceRange}
            onPriceChange={(val) => { setPriceRange(val); setPage(1); }}
            material={material}
            onMaterialChange={(val) => { setMaterial(val); setPage(1); }}
            sort={sort}
            onSortChange={(val) => { setSort(val); setPage(1); }}
            search={search}
            onSearchChange={(val) => { setSearch(val); setPage(1); }}
            onResetFilters={handleResetFilters}
          />
        </Grid>

        {/* Products Grid */}
        <Grid item xs={12} md={8.5} lg={9}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
              <CircularProgress sx={{ color: '#00B4D8' }} />
            </Box>
          ) : products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No bottles found matching your search or filters.
              </Typography>
              <Button variant="contained" className="btn-gradient" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} lg={4} key={product.id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Pagination
                    count={pagination.totalPages}
                    page={page}
                    onChange={(e, val) => setPage(val)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>

      {/* Mobile Drawer Filter */}
      <Drawer anchor="left" open={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)}>
        <Box sx={{ width: 300, p: 2 }}>
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={(val) => { setSelectedCategory(val); setPage(1); setMobileFilterOpen(false); }}
            priceRange={priceRange}
            onPriceChange={(val) => { setPriceRange(val); setPage(1); }}
            material={material}
            onMaterialChange={(val) => { setMaterial(val); setPage(1); setMobileFilterOpen(false); }}
            sort={sort}
            onSortChange={(val) => { setSort(val); setPage(1); setMobileFilterOpen(false); }}
            search={search}
            onSearchChange={(val) => { setSearch(val); setPage(1); }}
            onResetFilters={() => { handleResetFilters(); setMobileFilterOpen(false); }}
          />
        </Box>
      </Drawer>
    </Container>
  );
};

export default ProductsPage;
