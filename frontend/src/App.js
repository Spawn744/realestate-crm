import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PropertyList from './components/PropertyList';
import PropertyDetail from './components/PropertyDetail';
import PropertyForm from './components/PropertyForm';
import UserProfile from './components/UserProfile';
import LeadForm from './components/LeadForm';
import LeadList from './components/LeadList';
import ErrorBoundary from './components/ErrorBoundary';
import CalendarView from './components/CalendarView';
import AppointmentForm from './components/AppointmentForm';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes with layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/properties/new" element={<PropertyForm />} />
            <Route path="/appointments" element={<CalendarView />} />
            <Route path="/appointments/new" element={<AppointmentForm />} />
            <Route path="/properties/edit/:id" element={<PropertyForm />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/leads" element={<LeadList />} />
            <Route path="/leads/new" element={<ErrorBoundary><LeadForm/></ErrorBoundary>} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>

          {/* Catch-all redirect (optional) */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </Provider>
    
  );
}

export default App;