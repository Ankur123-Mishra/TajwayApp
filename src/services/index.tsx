import {
  DEMO_ACCOUNTS,
  DEMO_OTP,
  STORAGE_KEYS,
  VERIFICATION_STATUS,
} from '../constants/AppConstants';
import {mockUsers} from '../mockData';
import {storage} from '../utils/storage';
import {isValidIndianMobile} from '../utils/validation';
import {BookingService} from './bookingService';
import {DriverService} from './driverService';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const buildUser = (role, mobile) => {
  const base = mockUsers[role] || mockUsers.agent;
  return {
    ...base,
    mobile,
    phone: `+91 ${mobile}`,
    verificationStatus: VERIFICATION_STATUS.VERIFIED,
  };
};

export const AuthService = {
  async sendOtp(mobile) {
    await delay(400);
    const cleaned = String(mobile).replace(/\D/g, '').slice(-10);
    if (!isValidIndianMobile(cleaned)) {
      throw new Error('Enter a valid 10-digit Indian mobile number');
    }
    return {
      success: true,
      mobile: cleaned,
      message: 'OTP Sent to your mobile number',
      demoOtp: DEMO_OTP,
    };
  },

  async verifyOtp({mobile, otp}) {
    await delay(500);
    const cleaned = String(mobile).replace(/\D/g, '').slice(-10);
    if (String(otp) !== DEMO_OTP) {
      throw new Error('Invalid OTP. Please try again.');
    }

    const demoRole = DEMO_ACCOUNTS[cleaned];
    if (demoRole) {
      const user = buildUser(demoRole, cleaned);
      const session = {
        isLoggedIn: true,
        user,
        token: `mock-token-${user.id}`,
        role: demoRole,
        mobile: cleaned,
        onboardingCompleted: true,
        verificationStatus: VERIFICATION_STATUS.VERIFIED,
      };
      await storage.set(STORAGE_KEYS.AUTH_SESSION, session);
      return {
        isDemo: true,
        needsRegistration: false,
        ...session,
      };
    }

    return {
      isDemo: false,
      needsRegistration: true,
      mobile: cleaned,
      token: null,
      role: null,
      user: null,
      isLoggedIn: false,
    };
  },

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
      role: user.role,
      mobile: String(user.phone || '').replace(/\D/g, '').slice(-10),
      isLoggedIn: true,
    };
  },

  async loadSession() {
    const session = await storage.get(STORAGE_KEYS.AUTH_SESSION);
    const onboarded = await storage.get(STORAGE_KEYS.ONBOARDING);
    return {
      session,
      onboardingCompleted: onboarded === true || onboarded === 'true',
    };
  },

  async saveOnboarding(completed = true) {
    await storage.set(STORAGE_KEYS.ONBOARDING, completed);
  },

  async clearSession() {
    await storage.remove(STORAGE_KEYS.AUTH_SESSION);
  },
};

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

export {default as RegistrationService} from './registrationService';

export default {
  AuthService,
  BookingService,
  DriverService,
};
