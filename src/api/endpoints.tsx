/**
 * Central place for all API endpoints.
 * Update API_BASE_URL when switching environments.
 */

export const API_BASE_URL =
  'https://8e97-110-235-232-192.ngrok-free.app/api/v1/app';

export const ENDPOINTS = {
  // Auth
  SEND_OTP: '/auth/send-otp',
  VERIFY_OTP: '/auth/verify-otp',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
};
