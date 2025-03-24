import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button, Container, Typography, Avatar } from '@mui/material';
import { updateUser } from '../store/slices/authSlice';
import axios from '../api/axios';

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    agency: user?.agency || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch('/users/me/', formData);
      dispatch(updateUser(response.data));
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
        {user?.username[0]}
      </Avatar>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={user?.username}
          disabled
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <TextField
          label="Phone"
          fullWidth
          margin="normal"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <TextField
          label="Agency"
          fullWidth
          margin="normal"
          value={formData.agency}
          onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
        />
        <Button type="submit" variant="contained" sx={{ mt: 3 }}>
          Update Profile
        </Button>
      </form>
    </Container>
  );
};

export default UserProfile;