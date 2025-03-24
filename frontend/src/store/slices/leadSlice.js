import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Initial state for leads
const initialState = {
  leads: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk to fetch all leads for the logged-in user
export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Get the token from the auth slice (adjust the path as needed)
      const token = getState().auth.token;
      const response = await axios.get('/crm_api/leads/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Expected to be an array of leads
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk to add a new lead
export const addLead = createAsyncThunk(
  'leads/addLead',
  async (newLead, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post('/crm_api/leads/', newLead, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      if(err.response?.status === 400){
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({
        non_field_errors: ['Unable to create lead at this time']
      });
    }
  }
);

// (Optional) Async thunk to update a lead
export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async (updatedLead, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const { id, ...leadData } = updatedLead;
      const response = await axios.put(`/crm_api/leads/${id}/`, leadData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// (Optional) Async thunk to delete a lead
export const deleteLead = createAsyncThunk(
  'leads/deleteLead',
  async (leadId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`/crm_api/leads/${leadId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return leadId;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Create the lead slice
const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    // Synchronous action if needed to directly set leads
    setLeads(state, action) {
      state.leads = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Leads
      .addCase(fetchLeads.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leads = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      // Add Lead
      .addCase(addLead.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addLead.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leads.push(action.payload);
      })
      .addCase(addLead.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      // Update Lead
      .addCase(updateLead.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.leads.findIndex((lead) => lead.id === action.payload.id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      // Delete Lead
      .addCase(deleteLead.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leads = state.leads.filter((lead) => lead.id !== action.payload);
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

// Export synchronous actions if needed
export const { setLeads } = leadSlice.actions;

// Export the reducer to be added to the store
export default leadSlice.reducer;