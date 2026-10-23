import AsyncStorage from '@react-native-async-storage/async-storage';
// import {getWithToken, patchWithToken} from '../api/common';
// import {ENDPOINTS} from '../api/endpoints';
import {STORAGE_KEYS, USER_ROLES} from '../constants/AppConstants';
import {mockUsers} from '../mockData';
import {isValidEmail, required} from '../utils/validation';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Maps API user payload into the shape used across the app.
 */
const mapUser = user => {
  if (!user) {
    return null;
  }
  return {
    ...user,
    name: user.fullName || user.name || '',
    phone: user.mobile || user.phone || '',
    mobile: user.mobile || user.phone || '',
    company: user.companyName || user.company || '',
    companyName: user.companyName || user.company || '',
  };
};

/**
 * Merges updated user into the stored auth session.
 */
const persistUserInSession = async user => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    if (!raw) {
      return;
    }
    const session = JSON.parse(raw);
    const next = {
      ...session,
      user: {...(session.user || {}), ...user},
      role: user?.role || session.role,
    };
    await AsyncStorage.setItem(
      STORAGE_KEYS.AUTH_SESSION,
      JSON.stringify(next),
    );
  } catch {
    // Session persist is best-effort; Redux still holds the update.
  }
};

/**
 * Returns true when the user has finished partner verification.
 */
export const isVerificationComplete = user => {
  if (!user) {
    return false;
  }
  if (user.isVerifiedBadge === true) {
    return true;
  }
  const status = String(user.verificationStatus || '')
    .trim()
    .toLowerCase();
  return (
    status === 'verified' ||
    status === 'approved' ||
    status === 'complete' ||
    status === 'completed'
  );
};

export const UserService = {
  /**
   * GET /user/me — API commented out (static / demo mode).
   */
  async getMe() {
    // --- Real API (commented out) ---
    // const response = await getWithToken(ENDPOINTS.USER_ME);
    // if (!response?.success) {
    //   throw {
    //     message:
    //       response?.message || 'Failed to fetch user. Please try again.',
    //     data: response,
    //   };
    // }
    // const apiUser = response?.data?.user || response?.data || {};
    // const user = mapUser(apiUser);
    // await persistUserInSession(user);
    // return {
    //   success: true,
    //   message: response?.message || 'User fetched successfully',
    //   user,
    //   data: response?.data ?? null,
    // };

    await delay();
    const base = mockUsers.agent || {};
    const user = mapUser({
      ...base,
      fullName: base.name,
      role: base.role || USER_ROLES.AGENT,
      companyName: base.company,
      isVerifiedBadge: true,
      verificationStatus: 'verified',
      isOnboardingComplete: true,
    });
    await persistUserInSession(user);

    return {
      success: true,
      message: 'User fetched successfully',
      user,
      data: {user},
    };
  },

  /**
   * PATCH /user/profile
   * API commented out — updates local session only.
   */
  async updateProfile({fullName, role, city, companyName, email}) {
    const trimmedName = String(fullName || '').trim();
    const trimmedCity = String(city || '').trim();
    const trimmedCompany = String(companyName || '').trim();
    const trimmedEmail = String(email || '').trim();

    if (!required(trimmedName)) {
      throw {message: 'Please enter your full name'};
    }
    if (!required(trimmedCity)) {
      throw {message: 'Please select a city'};
    }
    if (!required(trimmedCompany)) {
      throw {message: 'Please enter your company name'};
    }
    if (!required(role)) {
      throw {message: 'Please select a role'};
    }
    if (trimmedEmail && !isValidEmail(trimmedEmail)) {
      throw {message: 'Please enter a valid email address'};
    }

    const body = {
      fullName: trimmedName,
      role,
      city: trimmedCity,
      companyName: trimmedCompany,
      ...(trimmedEmail ? {email: trimmedEmail} : {email: ''}),
    };

    // --- Real API (commented out) ---
    // const response = await patchWithToken(ENDPOINTS.UPDATE_PROFILE, body);
    // if (!response?.success) {
    //   throw {
    //     message:
    //       response?.message || 'Failed to update profile. Please try again.',
    //     data: response,
    //   };
    // }
    // const apiUser = response?.data?.user || response?.data || {};
    // const user = mapUser({
    //   ...apiUser,
    //   fullName: apiUser.fullName || trimmedName,
    //   role: apiUser.role || role,
    //   city: apiUser.city || trimmedCity,
    //   companyName: apiUser.companyName || trimmedCompany,
    //   email: apiUser.email ?? trimmedEmail,
    // });
    // await persistUserInSession(user);
    // return {
    //   success: true,
    //   message: response?.message || 'Profile updated successfully',
    //   user,
    //   data: response?.data ?? null,
    // };

    await delay();
    const user = mapUser(body);
    await persistUserInSession(user);

    return {
      success: true,
      message: 'Profile updated successfully',
      user,
      data: {user},
    };
  },
};

export default UserService;
