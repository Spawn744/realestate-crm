// AppointmentDetailModal.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
} from '@mui/material';

export default function AppointmentDetailModal({ open, handleClose, appointment }) {
  if (!appointment) return null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Appointment Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Client:</Typography>
            <Typography variant="body1">{appointment.client_name || 'Client'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Date & Time:</Typography>
            <Typography variant="body1">{new Date(appointment.datetime).toLocaleString()}</Typography>
          </Grid>
          {appointment.notes && (
            <Grid item xs={12}>
              <Typography variant="subtitle1">Notes:</Typography>
              <Typography variant="body1">{appointment.notes}</Typography>
            </Grid>
          )}
          {/* Add additional fields as needed */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        {/* Optionally, add Edit/Delete buttons here */}
      </DialogActions>
    </Dialog>
  );
}