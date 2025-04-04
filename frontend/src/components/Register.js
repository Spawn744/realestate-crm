import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Grid, Link } from '@mui/material';
import axios from '../api/axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: '',
    role: 'agent',
    phone: '',
    agency: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if ((await axios.post('api/register/', formData)).data.access) {

        localStorage.setItem('access_token', (await axios.post('api/register/', formData)).data.access);
        localStorage.setItem('refresh_token', (await axios.post('api/register/', formData)).data.refresh);



        dispatch(setCredentials({
          user: (await axios.post('api/register/', formData)).data.user,
          token: (await axios.post('api/register/', formData)).data.access, // If using JWT
          refresh: (await axios.post('api/register/', formData)).data.refresh
        }));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data); // correction was done
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      {error && <Typography color="error">{typeof error === 'object' ? JSON.stringify(error) : error}</Typography>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              name="username"
              fullWidth
              margin="normal"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="First Name"
              name="first_name"
              fullWidth
              margin="normal"
              required
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
          </Grid>  
          <Grid item xs={12}>
            <TextField
              label="Last Name"
              name="last_name"
              fullWidth
              margin="normal"
              required
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
            </Grid>
            
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Confirm Password"
              name="password2"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password2}
              onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Agency"
              fullWidth
              value={formData.agency}
              onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Link href="/login" variant="body2">
              Already have an account? Login
            </Link>
          </Grid>
        </Grid> 
      </form>
  </Container>
  );
}