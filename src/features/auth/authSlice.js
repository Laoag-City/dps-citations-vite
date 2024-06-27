// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('jwt') || null,
    user: JSON.parse(localStorage.getItem('user')) || {},
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('jwt', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      state.token = null;
      state.user = {};
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
