export const APP_NAME = 'Tajway';
export const APP_TAGLINE = "India's Biggest B2B Taxi Marketplace";
export const APP_TAGLINE_HI = 'Bharat Ki Apni Taxi Community';
export const APP_VERSION = 'Version 5.7.6 (prod)';

export const USER_ROLES = {
  AGENT: 'agent',
  DRIVER: 'driver',
  OWNER: 'owner',
};

export const ROLE_LABELS = {
  [USER_ROLES.AGENT]: 'Agent',
  [USER_ROLES.DRIVER]: 'Driver',
  [USER_ROLES.OWNER]: 'Owner',
};

export const BOOKING_STATUS = {
  DRAFT: 'draft',
  OPEN: 'open',
  QUOTED: 'quoted',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const VEHICLE_TYPES = [
  'Sedan',
  'SUV',
  'Innova',
  'Tempo',
  'Bus',
];

export const TRIP_TYPES = ['One Way', 'Round Trip', 'Local'];

export const VERIFICATION_STATUS = {
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
};

export const STORAGE_KEYS = {
  AUTH_SESSION: 'auth_session',
  ONBOARDING: 'onboarding_completed',
  BOOKINGS: 'bookings',
  DRIVER_INTERESTS: 'driver_interests',
};

/** Demo login shortcuts — mobile -> role */
export const DEMO_ACCOUNTS = {
  '9999999991': 'agent',
  '9999999992': 'driver',
  '9999999993': 'owner',
};

export const DEMO_OTP = '1234';

export const BOOKING_TYPES = {
  ONE_WAY: 'one_way',
  ROUND_TRIP: 'round_trip',
  BOTH: 'both',
};

export const OPERATING_STATES = [
  {id: 'delhi', name: 'Delhi', landmark: 'Lotus Temple'},
  {id: 'rajasthan', name: 'Rajasthan', landmark: 'Fort'},
  {id: 'uttarakhand', name: 'Uttarakhand', landmark: 'Temple'},
  {id: 'haryana', name: 'Haryana', landmark: 'Tower'},
];
