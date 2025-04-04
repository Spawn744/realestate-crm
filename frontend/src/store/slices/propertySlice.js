import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Generic error handler for thunks
const handleAsyncThunkError = (error) => {
  if (error.response) return Promise.reject(error.response.data);
  return Promise.reject(error.message || 'Network error');
};

// Unified properties fetch logic
export const fetchProperties = createAsyncThunk(
  'properties/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    // More robust token access
    const token = getState()?.auth?.token || localStorage.getItem('access_token');
    
    if (!token) {
      console.error('No token available in Redux or localStorage');
      throw new Error("Authorization token is missing");
    }

    try {
      const response = await axios.get('/crm_api/properties/', {
        timeout: 10000,
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timeout - server is not responding');
      }
      if (!error.response) {
        return rejectWithValue('Network error - no server response');
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProperty = createAsyncThunk(
  'properties/fetchOne',
  async (propertyId, { getState }) => {
    const { auth: { token } } = getState();
    console.log(`Fetching property ${propertyId} - Token:`, token);

    if (!token) throw new Error("Authorization token is missing");

    try {
      const response = await axios.get(`/crm_api/properties/${propertyId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return handleAsyncThunkError(error);
    }
  }
);

const initialState = {
  items: [],
  currentProperty: null,
  fetchPropertiesStatus: 'idle',
  fetchPropertyStatus: 'idle',
  error: null
};

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    clearCurrentProperty: (state) => {
      state.currentProperty = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all properties
      .addCase(fetchProperties.pending, (state) => {
        state.fetchPropertiesStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.fetchPropertiesStatus = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.fetchPropertiesStatus = 'failed';
        state.error = action.payload?.message || action.error.message || 'Failed to fetch properties';
      })
      
      // Fetch single property
      .addCase(fetchProperty.pending, (state) => {
        state.fetchPropertyStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchProperty.fulfilled, (state, action) => {
        state.fetchPropertyStatus = 'succeeded';
        state.currentProperty = action.payload;
      })
      .addCase(fetchProperty.rejected, (state, action) => {
        state.fetchPropertyStatus = 'failed';
        state.error = action.payload?.message || action.error.message || 'Failed to fetch properties';
      });
  }
});

export const { clearCurrentProperty } = propertySlice.actions;
export default propertySlice.reducer;