import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import driverReducer from './slices/driverSlice';
import marketplaceReducer from './slices/marketplaceSlice';
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    driver: driverReducer,
    marketplace: marketplaceReducer,
    notification: notificationReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
