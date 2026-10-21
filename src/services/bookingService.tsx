import {getWithToken, postWithToken} from '../api/common';
import {ENDPOINTS} from '../api/endpoints';
import {BOOKING_STATUS, STORAGE_KEYS} from '../constants/AppConstants';
import {mockBookings} from '../mockData';
import {storage} from '../utils/storage';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

const clone = value => JSON.parse(JSON.stringify(value));

const pad2 = n => String(n).padStart(2, '0');

const formatApiDate = date => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(
    date.getDate(),
  )}`;
};

const formatApiTime = date => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
};

const toSnakeCase = value =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const VEHICLE_TYPE_MAP = {
  hatchback: 'hatchback',
  sedan: 'sedan',
  suv: 'suv',
  innova: 'innova_crysta',
  innova_crysta: 'innova_crysta',
  ertiga: 'ertiga',
  tempo: 'tempo',
  bus: 'bus',
};

const EXTRA_REQUIREMENT_MAP = {
  only_diesel: 'only_diesel',
  with_carrier: 'with_carrier',
  inc_airport_parking: 'inc_airport_parking',
  inc_ac_in_plains: 'inc_ac_in_plains',
  all_inclusive: 'all_inclusive',
  all_exclusive: 'all_exclusive',
};

const mapVehicleType = value => {
  const key = toSnakeCase(value);
  return VEHICLE_TYPE_MAP[key] || key;
};

const mapExtraRequirements = (extras = []) =>
  extras
    .map(item => {
      const key = toSnakeCase(item);
      return EXTRA_REQUIREMENT_MAP[key] || key;
    })
    .filter(Boolean);

const toLocationObject = place => {
  const label = String(place || '').trim();
  if (!label) {
    return null;
  }
  const city = label.includes(',')
    ? label.split(',')[0].trim()
    : label;
  return {label, city};
};

/**
 * Builds API body for POST /bookings from the Post Booking form.
 */
export function buildCreateBookingPayload(form = {}) {
  const isRoundTrip =
    String(form.tripType || '')
      .toLowerCase()
      .includes('round');
  const isFixedAmount = /enter booking amount|fixed/i.test(
    String(form.amountType || ''),
  );
  const visibility = /network/i.test(String(form.visibility || ''))
    ? 'my_network'
    : 'public';

  const payload = {
    listingType: 'new_booking',
    tripType: isRoundTrip ? 'round_trip' : 'one_way',
    vehicleType: mapVehicleType(form.vehicleType),
    pickupDate: formatApiDate(form.pickupDateValue) || form.pickupDate || '',
    pickupTime: formatApiTime(form.pickupTimeValue) || form.pickupTime || '',
    pricingMode: isFixedAmount ? 'fixed_amount' : 'quote_best_price',
    commissionAmount: Number(form.commissionAmount) || 0,
    visibility,
    extraRequirements: mapExtraRequirements(form.extraRequirements),
  };

  if (isRoundTrip) {
    payload.pickupLocation = String(form.pickupLocation || '').trim();
    payload.numberOfDays = Number(form.numberOfDays) || 0;
    if (form.tourDescription?.trim()) {
      payload.tourDescription = form.tourDescription.trim();
    }
  } else {
    payload.pickupLocation = toLocationObject(form.pickupLocation);
    payload.dropLocation = toLocationObject(form.dropLocation);
    payload.isNegotiable = Boolean(form.isNegotiable);
    payload.isSecure = Boolean(form.isSecure);
  }

  if (isFixedAmount) {
    payload.bookingAmount = Number(form.bookingAmount) || 0;
    if (isRoundTrip) {
      payload.isNegotiable = Boolean(form.isNegotiable);
    }
  }

  if (isRoundTrip && form.isSecure != null) {
    payload.isSecure = Boolean(form.isSecure);
  }

  if (form.otherDetails?.trim()) {
    payload.otherDetails = form.otherDetails.trim();
  }

  return payload;
}

async function loadBookings() {
  const stored = await storage.get(STORAGE_KEYS.BOOKINGS);
  if (Array.isArray(stored) && stored.length > 0) {
    return stored;
  }
  const seed = clone(mockBookings);
  await storage.set(STORAGE_KEYS.BOOKINGS, seed);
  return seed;
}

async function saveBookings(bookings) {
  await storage.set(STORAGE_KEYS.BOOKINGS, bookings);
  return bookings;
}

/**
 * Builds API body for POST /bookings from the Post Free Vehicle form.
 */
export function buildCreateFreeVehiclePayload(form = {}) {
  const availableFrom =
    form.availableFrom instanceof Date && !Number.isNaN(form.availableFrom.getTime())
      ? form.availableFrom.toISOString()
      : String(form.availableFrom || '').trim();

  const availableTill =
    form.availableTill instanceof Date && !Number.isNaN(form.availableTill.getTime())
      ? form.availableTill.toISOString()
      : String(form.availableTill || '').trim();

  const payload = {
    listingType: 'free_vehicle',
    vehicleType: mapVehicleType(form.vehicleType),
    availableFrom,
    availableTill,
    vehicleLocation: String(form.vehicleLocation || '').trim(),
    availableFromAnyLocation: Boolean(form.availableFromAnyLocation),
  };

  if (form.details?.trim()) {
    payload.details = form.details.trim();
  }

  return payload;
}

const EXTRA_LABELS = {
  only_diesel: 'Only Diesel',
  with_carrier: 'With Carrier',
  inc_airport_parking: 'Inc Airport Parking',
  inc_ac_in_plains: 'Inc AC in plains',
  all_inclusive: 'All inclusive',
  all_exclusive: 'All exclusive',
};

const VEHICLE_LABELS = {
  hatchback: 'Hatchback',
  sedan: 'Sedan',
  suv: 'SUV',
  innova: 'Innova',
  innova_crysta: 'INNOVA CRYSTA',
  ertiga: 'Ertiga',
  tempo: 'Tempo',
  bus: 'Bus',
};

const formatPickupWhen = date => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }
  const today = new Date();
  const startToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const startPickup = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const dayDiff = Math.round(
    (startPickup.getTime() - startToday.getTime()) / (24 * 60 * 60 * 1000),
  );
  if (dayDiff === 0) {
    return 'Today';
  }
  if (dayDiff === 1) {
    return 'Tomorrow';
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatPickupTime = date => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }
  let hours = date.getHours();
  const minutes = pad2(date.getMinutes());
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${pad2(hours)}:${minutes} ${ampm}`;
};

const formatVehicleLabel = value => {
  const key = toSnakeCase(value);
  if (VEHICLE_LABELS[key]) {
    return VEHICLE_LABELS[key];
  }
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
};

const formatExtraLabels = (extras = []) =>
  (Array.isArray(extras) ? extras : [])
    .map(item => {
      const key = toSnakeCase(item);
      return (
        EXTRA_LABELS[key] ||
        String(item || '')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase())
      );
    })
    .filter(Boolean)
    .join(', ');

/**
 * Maps GET /bookings item into MarketBookingCard props.
 */
export function mapMarketBookingItem(item = {}) {
  const postedBy = item.postedBy || {};
  const pickup = item.pickupLocation || {};
  const drop = item.dropLocation || {};
  const pricing = item.pricing || {};
  const pickupAt = item.pickupAt ? new Date(item.pickupAt) : null;
  const hidePartner = Boolean(item.hideProfile || postedBy.isHidden);
  const isQuote =
    pricing.pricingMode === 'quote_best_price' || pricing.showAmount === false;

  const pickupLabel = pickup.label || pickup.city || '';
  const dropLabel = drop.label || drop.city || '';

  return {
    id: item.id || item.bookingCode,
    bookingCode: item.bookingCode,
    name: hidePartner
      ? 'Travel Partner'
      : postedBy.fullName || 'Travel Partner',
    company: hidePartner ? undefined : postedBy.companyName,
    when: formatPickupWhen(pickupAt),
    time: formatPickupTime(pickupAt),
    duration: item.numberOfDays ? `for ${item.numberOfDays} Days` : undefined,
    from: pickup.city || pickup.label || '',
    to: drop.city || drop.label || '',
    pickupFrom: pickupLabel,
    dropTo: dropLabel,
    tripType: /round/i.test(String(item.tripType || ''))
      ? 'Round Trip'
      : 'One Way',
    vehicle: formatVehicleLabel(item.vehicleType),
    vehicleType: item.vehicleType,
    notes: item.tourDescription || item.otherDetails || '',
    extras: formatExtraLabels(item.extraRequirements),
    totalAmount: isQuote ? null : pricing.bookingAmount,
    commission: pricing.commissionAmount,
    reviews: postedBy.reviewCount || 0,
    rating: postedBy.rating || 0,
    partnerHidden: hidePartner,
    secured: Boolean(item.isSecure),
    bookingType:
      item.visibility === 'my_network' ? 'Network Booking' : 'Public Booking',
    hasAvatar: Boolean(postedBy.profilePic),
    avatarUrl: postedBy.profilePic || null,
    raw: item,
  };
}

/**
 * GET /bookings?listingType=new_booking&page=&limit=
 */
export async function getMarketBookings({
  listingType = 'new_booking',
  page = 1,
  limit = 20,
} = {}) {
  const response = await getWithToken(ENDPOINTS.BOOKINGS, {
    listingType,
    page,
    limit,
  });

  if (!response?.success) {
    throw {
      message:
        response?.message || 'Failed to fetch bookings. Please try again.',
      data: response,
    };
  }

  const items = Array.isArray(response?.data?.items)
    ? response.data.items
    : Array.isArray(response?.data?.bookings)
      ? response.data.bookings
      : Array.isArray(response?.data)
        ? response.data
        : [];

  return {
    success: true,
    message: response?.message || 'Bookings fetched successfully',
    bookings: items.map(mapMarketBookingItem),
    meta: response?.data?.meta || null,
    data: response?.data ?? null,
  };
}

/**
 * POST /bookings — create a new booking listing (one_way / round_trip).
 */
export async function createBooking(form = {}) {
  const body = buildCreateBookingPayload(form);

  const response = await postWithToken(ENDPOINTS.BOOKINGS, body);

  if (!response?.success) {
    throw {
      message:
        response?.message || 'Failed to create booking. Please try again.',
      data: response,
    };
  }

  return {
    success: true,
    message: response?.message || 'Booking posted successfully',
    booking: response?.data?.booking || response?.data || null,
    data: response?.data ?? null,
  };
}

/**
 * POST /bookings — create a free vehicle listing.
 */
export async function createFreeVehicle(form = {}) {
  const body = buildCreateFreeVehiclePayload(form);

  const response = await postWithToken(ENDPOINTS.BOOKINGS, body);

  if (!response?.success) {
    throw {
      message:
        response?.message ||
        'Failed to post free vehicle. Please try again.',
      data: response,
    };
  }

  return {
    success: true,
    message: response?.message || 'Free vehicle posted successfully',
    booking: response?.data?.booking || response?.data || null,
    data: response?.data ?? null,
  };
}

export async function getBookings(filters = {}) {
  await delay();
  let bookings = await loadBookings();

  if (filters.agentId) {
    bookings = bookings.filter(b => b.agentId === filters.agentId);
  }
  if (filters.status) {
    bookings = bookings.filter(b => b.status === filters.status);
  }
  if (filters.vehicleType) {
    bookings = bookings.filter(b => b.vehicleType === filters.vehicleType);
  }
  if (filters.tripType) {
    bookings = bookings.filter(b => b.tripType === filters.tripType);
  }
  if (filters.pickupCity) {
    const city = String(filters.pickupCity).toLowerCase();
    bookings = bookings.filter(b => b.pickupCity?.toLowerCase() === city);
  }
  if (filters.dropCity) {
    const city = String(filters.dropCity).toLowerCase();
    bookings = bookings.filter(b => b.dropCity?.toLowerCase() === city);
  }
  if (filters.selectedDriverId) {
    bookings = bookings.filter(
      b => b.selectedDriverId === filters.selectedDriverId,
    );
  }

  return bookings;
}

export async function updateBooking(bookingId, updates = {}) {
  await delay();
  const bookings = await loadBookings();
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index === -1) {
    throw new Error('Booking not found');
  }
  bookings[index] = {...bookings[index], ...updates, id: bookingId};
  await saveBookings(bookings);
  return bookings[index];
}

export async function selectDriver(bookingId, driverId) {
  await delay();
  return updateBooking(bookingId, {
    selectedDriverId: driverId,
    status: BOOKING_STATUS.CONFIRMED,
    secured: true,
  });
}

export async function cancelBooking(bookingId) {
  await delay();
  return updateBooking(bookingId, {
    status: BOOKING_STATUS.CANCELLED,
  });
}

export const BookingService = {
  createBooking,
  createFreeVehicle,
  buildCreateBookingPayload,
  buildCreateFreeVehiclePayload,
  getMarketBookings,
  mapMarketBookingItem,
  getBookings,
  updateBooking,
  selectDriver,
  cancelBooking,
};

export default BookingService;
