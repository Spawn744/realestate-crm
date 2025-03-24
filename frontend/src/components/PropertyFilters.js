import React, { useState } from 'react';
import { TextField, MenuItem, Grid, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { filterProperties } from '../store/slices/propertySlice';

const PropertyFilters = () => {
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    status: 'all',
    location: ''
  });
  const dispatch = useDispatch();

  const handleFilter = () => {
    dispatch(filterProperties(filters));
  };

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12} md={3}>
        <TextField
          label="Min Price"
          type="number"
          fullWidth
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          label="Max Price"
          type="number"
          fullWidth
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          select
          label="Status"
          fullWidth
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="available">Available</MenuItem>
          <MenuItem value="sold">Sold</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} md={3}>
        <Button 
          variant="contained" 
          onClick={handleFilter}
          sx={{ height: '56px' }}
          fullWidth
        >
          Apply Filters
        </Button>
      </Grid>
    </Grid>
  );
};

export default PropertyFilters;