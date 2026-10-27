/**
 * Central place for all API endpoints.
 * Update API_BASE_URL when switching environments.
 */

export const API_BASE_URL =
  'https://tajway.techninza.in/api/v1/app';

export const ENDPOINTS = {
  // Auth
  SEND_OTP: '/auth/send-otp',
  VERIFY_OTP: '/auth/verify-otp',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',

  // User
  UPDATE_PROFILE: '/user/profile',
  USER_ME: '/user/me',

  // Bookings
  BOOKINGS: '/bookings',
  MY_BOOKINGS: '/bookings/mine',
  /** GET /bookings/:id — single booking details */
  BOOKING_DETAIL: id => `/bookings/${id}`,
};
