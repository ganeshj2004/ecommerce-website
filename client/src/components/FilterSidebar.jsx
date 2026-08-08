import React from 'react';
import {
  Box,
  Typography,
  Slider,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Paper,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const FilterSidebar = ({
  categories = [],
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  material,
  onMaterialChange,
  sort,
  onSortChange,
  search,
  onSearchChange,
  onResetFilters,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        backgroundColor: '#ffffff',
        position: 'sticky',
        top: 90,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterAltOutlinedIcon sx={{ color: '#00B4D8' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
            Filter Catalog
          </Typography>
        </Box>
        <Button
          size="small"
          onClick={onResetFilters}
          startIcon={<RestartAltIcon />}
          sx={{ color: '#64748B', textTransform: 'none', fontSize: '0.82rem' }}
        >
          Reset
        </Button>
      </Box>

      {/* Search Input */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search bottles..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#00B4D8' }} />
              </InputAdornment>
            ),
          }}
          sx={{ bgcolor: '#F8FAFC', borderRadius: '10px' }}
        />
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {/* Category Radio Group */}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#0F4C81' }}>
        Category
      </Typography>
      <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
        <RadioGroup value={selectedCategory || ''} onChange={(e) => onCategoryChange(e.target.value)}>
          <FormControlLabel
            value=""
            control={<Radio size="small" sx={{ color: '#00B4D8', '&.Mui-checked': { color: '#00B4D8' } }} />}
            label={<Typography variant="body2" sx={{ fontWeight: selectedCategory === '' ? 700 : 500 }}>All Categories</Typography>}
          />
          {categories.map((cat) => (
            <FormControlLabel
              key={cat.id}
              value={String(cat.id)}
              control={<Radio size="small" sx={{ color: '#00B4D8', '&.Mui-checked': { color: '#00B4D8' } }} />}
              label={<Typography variant="body2" sx={{ fontWeight: String(selectedCategory) === String(cat.id) ? 700 : 500 }}>{cat.name}</Typography>}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Divider sx={{ my: 2.5 }} />

      {/* Price Slider */}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#0F4C81' }}>
        Price Range ($)
      </Typography>
      <Box sx={{ px: 1, mb: 2 }}>
        <Slider
          value={priceRange}
          onChange={(e, newValue) => onPriceChange(newValue)}
          valueLabelDisplay="auto"
          min={0}
          max={100}
          sx={{ color: '#00B4D8' }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">${priceRange[0]}</Typography>
          <Typography variant="caption" color="text.secondary">${priceRange[1]}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {/* Material Filter */}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#0F4C81' }}>
        Material
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
        <Select
          value={material || ''}
          onChange={(e) => onMaterialChange(e.target.value)}
          displayEmpty
          sx={{ bgcolor: '#F8FAFC' }}
        >
          <MenuItem value="">All Materials</MenuItem>
          <MenuItem value="Stainless Steel">Stainless Steel</MenuItem>
          <MenuItem value="Borosilicate Glass">Borosilicate Glass</MenuItem>
          <MenuItem value="Tritan">BPA-Free Tritan</MenuItem>
          <MenuItem value="Bamboo">Glass & Bamboo</MenuItem>
        </Select>
      </FormControl>

      {/* Sort By Dropdown */}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#0F4C81' }}>
        Sort By
      </Typography>
      <FormControl fullWidth size="small">
        <Select value={sort || 'newest'} onChange={(e) => onSortChange(e.target.value)} sx={{ bgcolor: '#F8FAFC' }}>
          <MenuItem value="newest">Newest Arrivals</MenuItem>
          <MenuItem value="price_low">Price: Low to High</MenuItem>
          <MenuItem value="price_high">Price: High to Low</MenuItem>
          <MenuItem value="name">Alphabetical</MenuItem>
        </Select>
      </FormControl>
    </Paper>
  );
};

export default FilterSidebar;
