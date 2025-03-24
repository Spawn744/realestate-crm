import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../store/slices/AppointmentSlice';
import { LinearProgress, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const localizer = momentLocalizer(moment);

export default function CalendarView() {
  const dispatch = useDispatch();
  const { items: appointments, status } = useSelector(state => state.appointments);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month'); // Default view

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  if (status === 'loading') return <LinearProgress sx={{ mt: 2 }} />;
  if (status === 'failed') return <Typography color="error">Error loading appointments</Typography>;

  const events = (appointments || []).map(appt => ({
    title: `Meeting: ${appt.client_name || 'Client'}`,
    start: new Date(appt.datetime),
    end: new Date(appt.datetime),
    allDay: false,
    ...appt,
  }));

  return (
    <div style={{ height: '70vh', padding: '20px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        view={currentView}
        date={currentDate}
        onView={setCurrentView}
        onNavigate={setCurrentDate}
        onSelectEvent={(event) => setSelectedEvent(event)}
        style={{
          margin: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
        }}
      />

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
        <DialogTitle>Appointment Details</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <>
              <Typography><strong>Client:</strong> {selectedEvent.client_name}</Typography>
              <Typography><strong>Date:</strong> {moment(selectedEvent.start).format('MMMM Do YYYY, h:mm a')}</Typography>
              <Typography><strong>Details:</strong> {selectedEvent.details || 'No additional details'}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedEvent(null)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}