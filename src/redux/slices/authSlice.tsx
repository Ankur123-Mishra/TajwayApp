import {createSlice} from '@reduxjs/toolkit';
import {USER_ROLES} from '../../constants/AppConstants';

const initialState = {
  isAuthenticated: false,
  isOnboarded: false,
  hasPreferences: false,
  role: null,
  user: null,
  token: null,
  phone: null,
  preferences: {
    states: [],
    bookingType: null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setOnboarded(state, action) {
      state.isOnboarded = action.payload;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
    setPhone(state, action) {
      state.phone = action.payload;
    },
    setPreferences(state, action) {
      state.preferences = {...state.preferences, ...action.payload};
      state.hasPreferences = true;
    },
    loginSuccess(state, action) {
      const {user, token, role, phone} = action.payload;
      state.isAuthenticated = true;
      state.isOnboarded = true;
      state.user = user;
      state.token = token;
      state.phone = phone || user?.phone || state.phone;
      state.role = role || user?.role || USER_ROLES.AGENT;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.role = null;
      state.phone = null;
      state.hasPreferences = false;
      state.preferences = {states: [], bookingType: null};
    },
    updateUser(state, action) {
      state.user = {...state.user, ...action.payload};
    },
  },
});

export const {
  setOnboarded,
  setRole,
  setPhone,
  setPreferences,
  loginSuccess,
  logout,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
