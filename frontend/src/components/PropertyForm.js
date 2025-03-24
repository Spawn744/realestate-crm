import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Grid, Card, CardContent, Typography, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { createProperty } from '../api/propertyApi'; // import our create function
import axios from '../api/axios'; // if needed for GET calls
import ImageUpload from './ImageUpload';
import { useSelector } from 'react-redux';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  price: Yup.number()
    .required('Price is required')
    .min(1000, 'Minimum price is $1000'),
  location: Yup.string().required('Location is required'),
  status: Yup.string().required('Status is required'),
  description: Yup.string().max(500, 'Description must be less than 500 characters'),
});

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const token = useSelector((state) => state.auth.token);

  const formik = useFormik({
    initialValues: {
      title: '',
      price: '',
      location: '',
      status: '',
      description: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          // For editing, you can use axios.put directly
          await axios.put(`/crm_api/properties/${id}/`, values, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          navigate(`/properties/${id}`);
        } else {
          // Use createProperty function for creation
          const data = await createProperty(values, token);
          console.log('Created property resonse:', data);
          if (data && data.id) {
            navigate(`/properties/${data.id}`);
          }else {
            console.error(" Error: Property ID is undefined!", data);
          }
        }
      } catch (error) {
        console.error('Submission error:', error.response?.data || error.message);
      }
    }
  });

  useEffect(() => {
    const fetchProperty = async () => {
      if (!isEdit) return;
      
      try {
        const { data } = await axios.get(`/crm_api/properties/${id}/`);
        formik.setValues({
          title: data.title || '',
          price: data.price || '',
          location: data.location || '',
          status: data.status || '',
          description: data.description || '',
        });
      } catch (error) {
        console.error('Fetch error:', error.response?.data || error.message);
        navigate('/properties');
      }
    };

    fetchProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit, navigate]);

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {isEdit ? 'Edit Property' : 'Create New Property'}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Title Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            {/* Price Field */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
            </Grid>

            {/* Status Field */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
              >
                {['available', 'pending', 'sold'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Location Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
              />
            </Grid>

            {/* Description Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            {/* Image Upload Section (only in edit mode) */}
            {isEdit && (
              <Grid item xs={12}>
                <ImageUpload propertyId={id} />
              </Grid>
            )}

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                fullWidth
                disabled={formik.isSubmitting}
              >
                {isEdit ? 'Update Property' : 'Create Property'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}