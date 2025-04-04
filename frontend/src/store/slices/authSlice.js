import { createSlice } from '@reduxjs/toolkit';

const getInitialAuthState = () => {
  try {
    return {
      user: JSON.parse(localStorage.getItem('user')) || null,
      token: localStorage.getItem('access_token') || localStorage.getItem('token') || null,
      refreshToken: localStorage.getItem('refresh_token') || null,
      status: 'idle',
      error: null,
    };
  } catch (error) {
    console.error('Error parsing auth state from localStorage:', error);
    return {
      user: null,
      token: null,
      refreshToken: null,
      status: 'idle',
      error: null,
    };
  }
};

const initialState = getInitialAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, access, refresh } = action.payload;
      state.user = user;
      state.token = access;
      state.refreshToken = refresh;
      state.status = 'succeeded';
      state.error = null;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', access);
      if (refresh) {
        localStorage.setItem('refresh_token', refresh);
      }
      // Backward compatibility
      localStorage.setItem('token', access);
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.status = 'idle';
      state.error = null;

      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token');
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.status = 'failed';
    },
    resetAuthStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const { 
  setCredentials, 
  logout, 
  updateUser, 
  setAuthError,
  resetAuthStatus 
} = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;