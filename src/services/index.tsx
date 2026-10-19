import {
  STORAGE_KEYS,
  USER_ROLES,
  VERIFICATION_STATUS,
} from '../constants/AppConstants';
import {mockUsers} from '../mockData';
import {storage} from '../utils/storage';
import {AuthService as ApiAuthService} from './authService';
import {BookingService} from './bookingService';
import {DriverService} from './driverService';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/** Real OTP APIs + session helpers (sendOtp / verifyOtp / clearSession / loadSession). */
export const AuthService = {
  ...ApiAuthService,

  async loginWithRole({role, mobile, registrationData}) {
    await delay(300);
    const cleaned = String(mobile || '').replace(/\D/g, '').slice(-10);
    const base = mockUsers[role] || mockUsers.agent;
    const user = {
      ...base,
      ...registrationData,
      mobile: cleaned,
      phone: `+91 ${cleaned}`,
      role,
      verificationStatus:
        registrationData?.verificationStatus || VERIFICATION_STATUS.PENDING,
    };
    const session = {
      isLoggedIn: true,
      user,
      token: `mock-token-${user.id}-${Date.now()}`,
      role,
      mobile: cleaned,
      onboardingCompleted: true,
      verificationStatus: user.verificationStatus,
    };
    await storage.set(STORAGE_KEYS.AUTH_SESSION, session);
    return session;
  },

  /** Legacy email login kept for compatibility */
  async login({role}) {
    await delay();
    const user = mockUsers[role] || mockUsers.agent;
    return {
      user,
      token: `mock-token-${user.id}`,
      role: user.role || USER_ROLES.AGENT,
      mobile: String(user.phone || '').replace(/\D/g, '').slice(-10),
      isLoggedIn: true,
    };
  },

  async loadSession() {
    const session = await ApiAuthService.loadSession();
    const onboarded = await storage.get(STORAGE_KEYS.ONBOARDING);
    return {
      session,
      onboardingCompleted:
        session?.onboardingCompleted === true ||
        onboarded === true ||
        onboarded === 'true',
    };
  },

  async saveOnboarding(completed = true) {
    await storage.set(STORAGE_KEYS.ONBOARDING, completed);
  },

  async clearSession() {
    await ApiAuthService.clearSession();
  },
};

export {AuthService as ApiAuthService} from './authService';
export {default as authService} from './authService';

export {BookingService} from './bookingService';
export {
  createBooking,
  getBookings,
  updateBooking,
  selectDriver,
  cancelBooking,
} from './bookingService';

export {DriverService} from './driverService';
export {
  getAvailableBookings,
  showInterest,
  withdrawInterest,
  getDriverTrips,
  startTrip,
  completeTrip,
} from './driverService';

export default {
  AuthService,
  BookingService,
  DriverService,
};
