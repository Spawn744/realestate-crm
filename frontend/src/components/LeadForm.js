import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl,
  LinearProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addLead } from '../store/slices/leadSlice';
import { fetchProperties } from '../store/slices/propertySlice';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  property: Yup.number()
    .required('Property selection is required')
    .positive('Invalid property selection'),
  status: Yup.string().required('Status is required'),
  notes: Yup.string(),
});

export default function LeadForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { properties, loading } = useSelector((state) => state.properties);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        await dispatch(fetchProperties()).unwrap();
      } catch (error) {
        console.error('Failed to load properties:', error);
        if (error?.includes('token') || error?.includes('401')) {
          navigate('/login');
        }
      }
    };

    if (!properties?.length) loadProperties();
  }, [dispatch, navigate, properties]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      property: '',
      status: 'new',
      notes: '',
    },
    validationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        await dispatch(addLead(values)).unwrap();
        navigate('/leads');
      } catch (error) {
        console.error("Lead creation failed:", error);
        setErrors({
          property: error.message?.includes("property") 
            ? 'Please select a valid property' 
            : 'Submission failed. Please try again.'
        });
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
          {/* Name Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>

          {/* Email Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>

          {/* Phone Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
          </Grid>

          {/* Property Select */}
          <Grid item xs={12}>
            <FormControl fullWidth error={formik.touched.property && Boolean(formik.errors.property)}>
              <InputLabel id="property-select-label">Property</InputLabel>
              <Select
                labelId="property-select-label"
                inputProps={{ 'data-testid': 'property-select' }}
                name="property"
                value={formik.values.property ?? ''}
                onChange={(e) => {
                  console.log('Selected value:', e.target.value); // Debug log
                  formik.setFieldValue('property', Number(e.target.value));
                }}
                label="Property"
                disabled={loading || !properties?.length}
              >
                {loading ? (
                  <MenuItem disabled>Loading properties...</MenuItem>
                ) : properties?.length ? (
                  [
                    <MenuItem key="empty" value="" disabled>
                      Select a property
                    </MenuItem>,
                    ...properties.map((property) => (
                      <MenuItem key={property.id} value={property.id}>
                        {property.title} (ID: {property.id})
                      </MenuItem>
                    ))
                  ]
                ) : (
                  <MenuItem disabled>No properties available</MenuItem>
                )}
              </Select>
              {formik.touched.property && formik.errors.property && (
                <Typography color="error" variant="body2">
                  {formik.errors.property}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Loading State */}
          {loading && (
            <Grid item xs={12}>
              <LinearProgress />
              <Typography variant="body2" align="center">
                Loading properties...
              </Typography>
            </Grid>
          )}

          {/* Status Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              error={formik.touched.status && Boolean(formik.errors.status)}
              helperText={formik.touched.status && formik.errors.status}
            />
          </Grid>

          {/* Notes Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              multiline
              rows={4}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Creating...' : 'Create Lead'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}