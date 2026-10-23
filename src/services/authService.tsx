import AsyncStorage from '@react-native-async-storage/async-storage';
// import {post} from '../api/common';
// import {ENDPOINTS} from '../api/endpoints';
import {STORAGE_KEYS, USER_ROLES} from '../constants/AppConstants';
import {mockUsers} from '../mockData';

const cleanMobile = mobile =>
  String(mobile || '')
    .replace(/\D/g, '')
    .slice(-10);

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

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
   * POST /auth/send-otp — API commented out (static / demo mode).
   * Accepts any valid 10-digit Indian mobile number.
   */
  async sendOtp(mobile) {
    const cleaned = cleanMobile(mobile);
    // Demo mode: any 10-digit number is accepted.
    if (cleaned.length !== 10) {
      throw {message: 'Enter a valid 10-digit mobile number'};
    }

    // --- Real API (commented out) ---
    // const response = await post(ENDPOINTS.SEND_OTP, {mobile: cleaned});
    // if (!response?.success) {
    //   throw {
    //     message: response?.message || 'Failed to send OTP. Please try again.',
    //     data: response,
    //   };
    // }
    // return {
    //   success: true,
    //   mobile: cleaned,
    //   message: response?.message || 'OTP sent successfully',
    //   data: response?.data ?? null,
    // };

    await delay();
    return {
      success: true,
      mobile: cleaned,
      message: 'OTP sent successfully',
      data: null,
    };
  },

  /**
   * POST /auth/verify-otp — API commented out (static / demo mode).
   * Accepts any OTP (4+ digits) for any valid 10-digit mobile.
   */
  async verifyOtp({mobile, otp}) {
    const cleaned = cleanMobile(mobile);
    const otpCode = String(otp || '').trim();

    // Demo mode: any 10-digit number + any OTP (4+ digits).
    if (cleaned.length !== 10) {
      throw {message: 'Enter a valid 10-digit mobile number'};
    }
    if (otpCode.length < 4) {
      throw {message: 'Please enter a valid OTP'};
    }

    // --- Real API (commented out) ---
    // const response = await post(ENDPOINTS.VERIFY_OTP, {
    //   mobile: cleaned,
    //   otp: otpCode,
    // });
    // if (!response?.success) {
    //   throw {
    //     message: response?.message || 'Invalid OTP. Please try again.',
    //     data: response,
    //   };
    // }
    // const payload = response?.data || {};
    // const user = mapUser(payload.user, cleaned);
    // const role = user?.role || USER_ROLES.AGENT;
    // const accessToken = payload.accessToken || null;
    // const refreshToken = payload.refreshToken || null;
    // const isOnboardingComplete = Boolean(
    //   user?.isOnboardingComplete ?? payload.isOnboardingComplete,
    // );
    // const session = {
    //   isLoggedIn: true,
    //   user,
    //   token: accessToken,
    //   accessToken,
    //   refreshToken,
    //   tokenType: 'Bearer',
    //   expiresIn: null,
    //   refreshExpiresAt: null,
    //   role,
    //   phone: cleaned,
    //   mobile: cleaned,
    //   isNewUser: false,
    //   nextStep: null,
    //   isOnboardingComplete,
    //   onboardingCompleted: isOnboardingComplete,
    // };
    // await persistSession(session);
    // return {
    //   success: true,
    //   message: response?.message || 'OTP verified successfully',
    //   ...session,
    // };

    await delay();

    const base = mockUsers.agent || {};
    const user = mapUser(
      {
        ...base,
        id: base.id || 'agent-001',
        fullName: base.name || 'Demo User',
        role: USER_ROLES.AGENT,
        mobile: cleaned,
        isOnboardingComplete: true,
        isVerifiedBadge: true,
        verificationStatus: 'verified',
      },
      cleaned,
    );
    const role = USER_ROLES.AGENT;
    const accessToken = `mock-token-${cleaned}-${Date.now()}`;

    const session = {
      isLoggedIn: true,
      user,
      token: accessToken,
      accessToken,
      refreshToken: null,
      tokenType: 'Bearer',
      expiresIn: null,
      refreshExpiresAt: null,
      role,
      phone: cleaned,
      mobile: cleaned,
      isNewUser: false,
      nextStep: null,
      isOnboardingComplete: true,
      onboardingCompleted: true,
    };

    await persistSession(session);

    return {
      success: true,
      message: 'OTP verified successfully',
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
