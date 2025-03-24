import React, { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeads } from '../store/slices/leadSlice';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const columns = [
  { field: 'clientName', headerName: 'Client', width: 200 },
  { field: 'propertyTitle', headerName: 'Property', width: 250 },
  { field: 'status', headerName: 'Status', width: 150 },
  { field: 'lastContact', headerName: 'Last Contact', width: 200 },
  { 
    field: 'actions', 
    headerName: 'Actions', 
    width: 150,
    renderCell: (params) => (
      <Button
        component={Link}
        to={`/leads/${params.row.id}`}
        variant="outlined"
        size="small"
      >
        Details
      </Button>
    )
  }
];

export default function LeadList() {
  const dispatch = useDispatch();
  const leads = useSelector((state) => state.leads); 


  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  return (
    <div style={{ height: 600, width: '100%' }}>
      <Button 
        component={Link} 
        to="/leads/new"
        variant="contained" 
        sx={{ mb: 2 }}
      >
        Add New Lead
      </Button>
      
      <DataGrid
        rows={leads}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />
    </div>
  );
}