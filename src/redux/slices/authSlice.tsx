import {createSlice} from '@reduxjs/toolkit';
import {USER_ROLES} from '../../constants/AppConstants';

const initialState = {
  isAuthenticated: false,
  isOnboarded: false,
  hasPreferences: false,
  role: null,
  user: null,
  token: null,
  refreshToken: null,
  phone: null,
  isNewUser: false,
  nextStep: null,
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
      const {
        user,
        token,
        accessToken,
        refreshToken,
        role,
        phone,
        mobile,
        isOnboardingComplete,
        onboardingCompleted,
        isNewUser,
        nextStep,
      } = action.payload;

      state.isAuthenticated = true;
      state.user = user;
      state.token = token || accessToken || null;
      state.refreshToken = refreshToken || null;
      state.phone = phone || mobile || user?.mobile || user?.phone || state.phone;
      state.role = role || user?.role || USER_ROLES.AGENT;
      state.isNewUser = Boolean(isNewUser);
      state.nextStep = nextStep || null;
      state.isOnboarded = Boolean(
        isOnboardingComplete ?? onboardingCompleted ?? true,
      );
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.role = null;
      state.phone = null;
      state.isNewUser = false;
      state.nextStep = null;
      state.hasPreferences = false;
      state.isOnboarded = false;
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
