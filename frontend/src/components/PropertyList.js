import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { fetchProperties } from '../store/slices/propertySlice';

const columns = [
  { field: 'title', headerName: 'Title', width: 200 },
  { field: 'price', headerName: 'Price', width: 120 },
  { field: 'location', headerName: 'Location', width: 200 },
  { field: 'status', headerName: 'Status', width: 120 },
];

export default function PropertyList() {
  const dispatch = useDispatch();
  const properties = useSelector((state) => state.properties.items);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchProperties());
    }
  }, [dispatch, token]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Button 
        component={Link} 
        to="/properties/new"
        variant="contained" 
        sx={{ mb: 2 }}
      >
        Add New Property
      </Button>
      
      <DataGrid
        rows={properties}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
}