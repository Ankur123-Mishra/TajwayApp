import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  selectedBookingId: null,
  filters: {
    status: null,
    vehicleType: null,
  },
  loading: false,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookings(state, action) {
      state.bookings = action.payload;
    },
    setSelectedBookingId(state, action) {
      state.selectedBookingId = action.payload;
    },
    setBookingFilters(state, action) {
      state.filters = {...state.filters, ...action.payload};
    },
    setBookingLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const {
  setBookings,
  setSelectedBookingId,
  setBookingFilters,
  setBookingLoading,
} = bookingSlice.actions;

export default bookingSlice.reducer;
