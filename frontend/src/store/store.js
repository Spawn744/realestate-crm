import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import appointmentReducer from './slices/AppointmentSlice';
import dashboardReducer from './slices/dashboardSlice';
import leadReducer from './slices/leadSlice';


export default configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    appointments: appointmentReducer,
    dashboard: dashboardReducer,
    Leads: leadReducer,
  },
})