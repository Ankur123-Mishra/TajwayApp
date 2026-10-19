import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from './endpoints';
import {STORAGE_KEYS} from '../constants/AppConstants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // Required for ngrok free tunnels to return JSON instead of browser interstitial
    'ngrok-skip-browser-warning': 'true',
  },
});

/**
 * Reads auth token from stored session.
 */
export const getAuthToken = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    if (!raw) {
      return null;
    }
    const session = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return session?.token || session?.accessToken || null;
  } catch {
    return null;
  }
};

/**
 * Builds Authorization header when a token is available.
 */
export const getAuthHeaders = async (extraHeaders = {}) => {
  const token = await getAuthToken();
  return {
    ...extraHeaders,
    ...(token ? {Authorization: `Bearer ${token}`} : {}),
  };
};

/**
 * Normalizes axios / network errors into a consistent shape.
 */
const handleApiError = error => {
  if (error.response) {
    const {status, data} = error.response;
    const message =
      data?.message || data?.error || error.message || 'Something went wrong';
    return Promise.reject({
      status,
      message,
      data,
      isNetworkError: false,
    });
  }

  if (error.request) {
    return Promise.reject({
      status: 0,
      message: 'Network error. Please check your internet connection.',
      data: null,
      isNetworkError: true,
    });
  }

  return Promise.reject({
    status: 0,
    message: error.message || 'Unexpected error occurred',
    data: null,
    isNetworkError: false,
  });
};

/**
 * GET request without auth token.
 */
export const get = async (url, params = {}, config = {}) => {
  try {
    const response = await axiosInstance.get(url, {
      params,
      ...config,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * GET request with Bearer auth token.
 */
export const getWithToken = async (url, params = {}, config = {}) => {
  try {
    const headers = await getAuthHeaders(config.headers);
    const response = await axiosInstance.get(url, {
      params,
      ...config,
      headers,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * POST request without auth token.
 */
export const post = async (url, data = {}, config = {}) => {
  try {
    const response = await axiosInstance.post(url, data, config);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * POST request with Bearer auth token.
 */
export const postWithToken = async (url, data = {}, config = {}) => {
  try {
    const headers = await getAuthHeaders(config.headers);
    const response = await axiosInstance.post(url, data, {
      ...config,
      headers,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * PUT request with Bearer auth token.
 */
export const putWithToken = async (url, data = {}, config = {}) => {
  try {
    const headers = await getAuthHeaders(config.headers);
    const response = await axiosInstance.put(url, data, {
      ...config,
      headers,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * PATCH request with Bearer auth token.
 */
export const patchWithToken = async (url, data = {}, config = {}) => {
  try {
    const headers = await getAuthHeaders(config.headers);
    const response = await axiosInstance.patch(url, data, {
      ...config,
      headers,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export {axiosInstance};
export default axiosInstance;
