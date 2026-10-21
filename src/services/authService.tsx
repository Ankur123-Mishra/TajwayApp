import AsyncStorage from '@react-native-async-storage/async-storage';
import {post} from '../api/common';
import {ENDPOINTS} from '../api/endpoints';
import {STORAGE_KEYS, USER_ROLES} from '../constants/AppConstants';
import {isValidIndianMobile} from '../utils/validation';

const cleanMobile = mobile =>
  String(mobile || '')
    .replace(/\D/g, '')
    .slice(-10);

/**
 * Maps API user payload into the shape used across the app.
 */

const mapUser = (user, mobile) => {
  if (!user) {
    return null;
  }
  return {
    ...user,
    name: user.fullName || user.name || '',
    phone: user.mobile || mobile,
    mobile: user.mobile || mobile,
  };
};

/**
 * Persists auth session so axios can attach Bearer tokens later.
 */
 
const persistSession = async session => {
  await AsyncStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
  return session;
};

export const AuthService = {
  
  /**
   * POST /auth/send-otp
   * Body: { mobile }
   */

  async sendOtp(mobile) {
    const cleaned = cleanMobile(mobile);
    if (!isValidIndianMobile(cleaned)) {
      throw {message: 'Enter a valid 10-digit Indian mobile number'};
    }

    const response = await post(ENDPOINTS.SEND_OTP, {mobile: cleaned});

    if (!response?.success) {
      throw {
        message: response?.message || 'Failed to send OTP. Please try again.',
        data: response,
      };
    }

    return {
      success: true,
      mobile: cleaned,
      message: response?.message || 'OTP sent successfully',
      data: response?.data ?? null,
    };
  },

  /**
   * POST /auth/verify-otp
   * Body: { mobile, otp }
   */

  async verifyOtp({mobile, otp}) {
    const cleaned = cleanMobile(mobile);
    const otpCode = String(otp || '').trim();

    if (!isValidIndianMobile(cleaned)) {
      throw {message: 'Enter a valid 10-digit Indian mobile number'};
    }
    if (otpCode.length < 4) {
      throw {message: 'Please enter a valid OTP'};
    }

    const response = await post(ENDPOINTS.VERIFY_OTP, {
      mobile: cleaned,
      otp: otpCode,
    });

    console.log('Verify OTP API response:', JSON.stringify(response, null, 2));

    if (!response?.success) {
      throw {
        message: response?.message || 'Invalid OTP. Please try again.',
        data: response,
      };
    }

    const payload = response?.data || {};
    const user = mapUser(payload.user, cleaned);
    const role = user?.role || USER_ROLES.AGENT;
    const accessToken = payload.accessToken || null;
    const refreshToken = payload.refreshToken || null;
    const isOnboardingComplete = Boolean(
      user?.isOnboardingComplete ?? payload.isOnboardingComplete,
    );

    const session = {
      isLoggedIn: true,
      user,
      token: accessToken,
      accessToken,
      refreshToken,
      tokenType: payload.tokenType || 'Bearer',
      expiresIn: payload.expiresIn || null,
      refreshExpiresAt: payload.refreshExpiresAt || null,
      role,
      phone: cleaned,
      mobile: cleaned,
      isNewUser: Boolean(payload.isNewUser),
      nextStep: payload.nextStep || null,
      isOnboardingComplete,
      onboardingCompleted: isOnboardingComplete,
    };

    await persistSession(session);

    return {
      success: true,
      message: response?.message || 'OTP verified successfully',
      ...session,
    };
  },

  async clearSession() {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  },

  async loadSession() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
};

export default AuthService;
