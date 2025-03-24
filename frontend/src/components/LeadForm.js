import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Container, Typography, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addLead } from '../store/slices/leadSlice';
import { useNavigate } from 'react-router-dom';
import { fetchProperties } from '../store/slices/propertySlice'

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  property: Yup.number()
    .required('Property selection is required')
    .positive('invalid property selection'),
  status: Yup.string().required('Status is required'),
  notes: Yup.string(),
});

export default function LeadForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { properties } = useSelector((state) => state.properties )
  
  useEffect(() =>{
    dispatch(fetchProperties());
  }, [dispatch] )
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      property: 'null',
      status: 'new',
      notes: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Dispatch the createLead thunk; unwrap to handle errors if needed
        await dispatch(addLead(values)).unwrap();
        navigate('/leads');
      } catch (error) {
        console.error("Lead creation failed:", error);
        if (error.message.includes?.("property")) {
          formik.setFieldError('property', 'Please select a valid property');
        }
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Lead
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              fullWidth
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              fullWidth
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={formik.touched.property && Boolean(formik.errors.property)}>
              <InputLabel>Property</InputLabel>
              <Select
                name="property"
                value={formik.values.property ?? ''}
                onChange={(e) => formik.setFieldValue('property', Number(e.target.value))}
                label='Property'
              >
                <MenuItem value= "" disabled>Select a property</MenuItem>
                {properties?.map((property) => (
                  <MenuItem key={property.id} value={property.id}>
                    {property.title} {/* Adjust based on your Property model fields */}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.property && formik.errors.property && (
                <Typography color="error" variant="body2">
                  {formik.errors.property}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Status"
              fullWidth
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              error={formik.touched.status && Boolean(formik.errors.status)}
              helperText={formik.touched.status && formik.errors.status}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notes"
              fullWidth
              name="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Create Lead
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}