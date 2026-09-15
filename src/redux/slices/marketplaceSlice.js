import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  filters: {
    pickupCity: '',
    destination: '',
    date: '',
    vehicleType: '',
    budget: null,
    tripType: '',
  },
  sort: 'latest', // latest | highest_budget | nearest | pickup_date
};

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    setMarketplaceBookings(state, action) {
      state.bookings = action.payload || [];
    },
    setFilters(state, action) {
      state.filters = {...state.filters, ...action.payload};
    },
    clearFilters(state) {
      state.filters = {...initialState.filters};
    },
    setSort(state, action) {
      const allowed = ['latest', 'highest_budget', 'nearest', 'pickup_date'];
      if (allowed.includes(action.payload)) {
        state.sort = action.payload;
      }
    },
  },
});

export const {setMarketplaceBookings, setFilters, clearFilters, setSort} =
  marketplaceSlice.actions;

export const getSortedMarketplaceBookings = state => {
  const {bookings, filters, sort} = state.marketplace || initialState;
  let list = [...bookings];

  if (filters.pickupCity) {
    const city = filters.pickupCity.toLowerCase();
    list = list.filter(b => b.pickupCity?.toLowerCase().includes(city));
  }
  if (filters.destination) {
    const dest = filters.destination.toLowerCase();
    list = list.filter(
      b =>
        b.dropCity?.toLowerCase().includes(dest) ||
        b.drop?.toLowerCase().includes(dest),
    );
  }
  if (filters.date) {
    list = list.filter(b => b.date === filters.date);
  }
  if (filters.vehicleType) {
    list = list.filter(b => b.vehicleType === filters.vehicleType);
  }
  if (filters.tripType) {
    list = list.filter(b => b.tripType === filters.tripType);
  }
  if (filters.budget != null && filters.budget !== '') {
    const max = Number(filters.budget);
    if (!Number.isNaN(max)) {
      list = list.filter(b => Number(b.budget) <= max);
    }
  }

  switch (sort) {
    case 'highest_budget':
      list.sort((a, b) => Number(b.budget) - Number(a.budget));
      break;
    case 'pickup_date':
      list.sort((a, b) => String(a.date).localeCompare(String(b.date)));
      break;
    case 'nearest':
      // Mock: prefer bookings matching driver city via filter pickupCity first;
      // otherwise keep original order as proximity proxy.
      break;
    case 'latest':
    default:
      list.sort((a, b) => String(b.id).localeCompare(String(a.id)));
      break;
  }

  return list;
};

export default marketplaceSlice.reducer;
