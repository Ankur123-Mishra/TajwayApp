import {createSlice} from '@reduxjs/toolkit';
import {BOOKING_STATUS} from '../../constants/AppConstants';

const initialState = {
  online: false,
  availability: true,
  trips: [],
  interests: [],
  profile: null,
};

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    setOnline(state, action) {
      state.online = !!action.payload;
    },
    setAvailability(state, action) {
      state.availability = !!action.payload;
    },
    setTrips(state, action) {
      state.trips = action.payload || [];
    },
    setInterests(state, action) {
      state.interests = action.payload || [];
    },
    updateProfile(state, action) {
      state.profile = {...(state.profile || {}), ...action.payload};
    },
    showInterest(state, action) {
      const {bookingId, driverId} = action.payload || {};
      if (!bookingId) {
        return;
      }
      if (!state.interests.includes(bookingId)) {
        state.interests.push(bookingId);
      }
      // keep driverId on profile for convenience when provided
      if (driverId && state.profile) {
        state.profile.id = state.profile.id || driverId;
      }
    },
    withdrawInterest(state, action) {
      const bookingId = action.payload?.bookingId || action.payload;
      state.interests = state.interests.filter(id => id !== bookingId);
    },
    startTrip(state, action) {
      const booking = action.payload;
      if (!booking?.id) {
        return;
      }
      const existing = state.trips.findIndex(t => t.id === booking.id);
      const trip = {
        ...booking,
        status: BOOKING_STATUS.ONGOING,
        startedAt: new Date().toISOString(),
      };
      if (existing >= 0) {
        state.trips[existing] = trip;
      } else {
        state.trips.unshift(trip);
      }
    },
    completeTrip(state, action) {
      const bookingId = action.payload?.bookingId || action.payload;
      const index = state.trips.findIndex(t => t.id === bookingId);
      if (index === -1) {
        return;
      }
      state.trips[index] = {
        ...state.trips[index],
        status: BOOKING_STATUS.COMPLETED,
        completedAt: new Date().toISOString(),
      };
      state.interests = state.interests.filter(id => id !== bookingId);
    },
  },
});

export const {
  setOnline,
  setAvailability,
  setTrips,
  setInterests,
  updateProfile,
  showInterest,
  withdrawInterest,
  startTrip,
  completeTrip,
} = driverSlice.actions;

export default driverSlice.reducer;
