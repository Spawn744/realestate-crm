// AppointmentForm.js
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Container, Typography, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { createAppointment } from '../store/slices/AppointmentSlice'; // You'll need to create this thunk
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  datetime: Yup.date().required('Date and time are required'),
  client: Yup.string().required('Client is required'),
  notes: Yup.string(),
  // Add other fields as needed
});

export default function AppointmentForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      datetime: '',
      client: '',
      notes: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(createAppointment(values)).unwrap();
        navigate('/appointments'); // or wherever you want to redirect
      } catch (error) {
        console.error("Appointment creation failed:", error);
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Appointment
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Date & Time"
              type="datetime-local"
              fullWidth
              name="datetime"
              InputLabelProps={{ shrink: true }}
              value={formik.values.datetime}
              onChange={formik.handleChange}
              error={formik.touched.datetime && Boolean(formik.errors.datetime)}
              helperText={formik.touched.datetime && formik.errors.datetime}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Client"
              fullWidth
              name="client"
              value={formik.values.client}
              onChange={formik.handleChange}
              error={formik.touched.client && Boolean(formik.errors.client)}
              helperText={formik.touched.client && formik.errors.client}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={4}
              name="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Create Appointment
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}