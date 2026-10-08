import {BOOKING_STATUS, STORAGE_KEYS} from '../constants/AppConstants';
import {mockBookings} from '../mockData';
import {storage} from '../utils/storage';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

const AVAILABLE_STATUSES = [
  BOOKING_STATUS.POSTED,
  BOOKING_STATUS.LOOKING,
  BOOKING_STATUS.INTERESTED,
];

async function loadBookings() {
  const stored = await storage.get(STORAGE_KEYS.BOOKINGS);
  if (Array.isArray(stored) && stored.length > 0) {
    return stored;
  }
  return JSON.parse(JSON.stringify(mockBookings));
}

async function saveBookings(bookings) {
  await storage.set(STORAGE_KEYS.BOOKINGS, bookings);
  return bookings;
}

async function loadInterests() {
  const stored = await storage.get(STORAGE_KEYS.DRIVER_INTERESTS);
  return Array.isArray(stored) ? stored : [];
}

async function saveInterests(interests) {
  await storage.set(STORAGE_KEYS.DRIVER_INTERESTS, interests);
  return interests;
}

export async function getAvailableBookings(filters = {}) {
  await delay();
  let bookings = await loadBookings();
  bookings = bookings.filter(b => AVAILABLE_STATUSES.includes(b.status));

  if (filters.pickupCity) {
    const city = String(filters.pickupCity).toLowerCase();
    bookings = bookings.filter(b => b.pickupCity?.toLowerCase().includes(city));
  }
  if (filters.vehicleType) {
    bookings = bookings.filter(b => b.vehicleType === filters.vehicleType);
  }
  if (filters.tripType) {
    bookings = bookings.filter(b => b.tripType === filters.tripType);
  }
  if (filters.date) {
    bookings = bookings.filter(b => b.date === filters.date);
  }
  if (filters.maxBudget != null) {
    const max = Number(filters.maxBudget);
    if (!Number.isNaN(max)) {
      bookings = bookings.filter(b => Number(b.budget) <= max);
    }
  }

  return bookings;
}

export async function showInterest({bookingId, driverId}) {
  await delay();
  if (!bookingId || !driverId) {
    throw new Error('bookingId and driverId are required');
  }

  const bookings = await loadBookings();
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index === -1) {
    throw new Error('Booking not found');
  }

  const booking = bookings[index];
  const interestedDrivers = Array.isArray(booking.interestedDrivers)
    ? [...booking.interestedDrivers]
    : [];

  if (!interestedDrivers.includes(driverId)) {
    interestedDrivers.push(driverId);
  }

  bookings[index] = {
    ...booking,
    interestedDrivers,
    interestedCount: interestedDrivers.length,
    status:
      booking.status === BOOKING_STATUS.POSTED ||
      booking.status === BOOKING_STATUS.LOOKING
        ? BOOKING_STATUS.INTERESTED
        : booking.status,
  };
  await saveBookings(bookings);

  const interests = await loadInterests();
  const exists = interests.find(
    i => i.bookingId === bookingId && i.driverId === driverId,
  );
  if (!exists) {
    interests.push({
      bookingId,
      driverId,
      shownAt: new Date().toISOString(),
    });
    await saveInterests(interests);
  }

  return bookings[index];
}

export async function withdrawInterest({bookingId, driverId}) {
  await delay();
  if (!bookingId || !driverId) {
    throw new Error('bookingId and driverId are required');
  }

  const bookings = await loadBookings();
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index === -1) {
    throw new Error('Booking not found');
  }

  const booking = bookings[index];
  const interestedDrivers = (booking.interestedDrivers || []).filter(
    id => id !== driverId,
  );

  let status = booking.status;
  if (
    interestedDrivers.length === 0 &&
    status === BOOKING_STATUS.INTERESTED
  ) {
    status = BOOKING_STATUS.LOOKING;
  }

  bookings[index] = {
    ...booking,
    interestedDrivers,
    interestedCount: interestedDrivers.length,
    status,
  };
  await saveBookings(bookings);

  const interests = await loadInterests();
  await saveInterests(
    interests.filter(
      i => !(i.bookingId === bookingId && i.driverId === driverId),
    ),
  );

  return bookings[index];
}

export async function getDriverTrips(driverId) {
  await delay();
  const bookings = await loadBookings();
  return bookings.filter(
    b =>
      b.selectedDriverId === driverId &&
      [
        BOOKING_STATUS.CONFIRMED,
        BOOKING_STATUS.ONGOING,
        BOOKING_STATUS.COMPLETED,
      ].includes(b.status),
  );
}

export async function startTrip({bookingId, driverId}) {
  await delay();
  const bookings = await loadBookings();
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index === -1) {
    throw new Error('Booking not found');
  }
  if (driverId && bookings[index].selectedDriverId !== driverId) {
    throw new Error('Driver is not assigned to this booking');
  }
  bookings[index] = {
    ...bookings[index],
    status: BOOKING_STATUS.ONGOING,
    startedAt: new Date().toISOString(),
  };
  await saveBookings(bookings);
  return bookings[index];
}

export async function completeTrip({bookingId, driverId}) {
  await delay();
  const bookings = await loadBookings();
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index === -1) {
    throw new Error('Booking not found');
  }
  if (driverId && bookings[index].selectedDriverId !== driverId) {
    throw new Error('Driver is not assigned to this booking');
  }
  bookings[index] = {
    ...bookings[index],
    status: BOOKING_STATUS.COMPLETED,
    completedAt: new Date().toISOString(),
  };
  await saveBookings(bookings);
  return bookings[index];
}

export const DriverService = {
  getAvailableBookings,
  showInterest,
  withdrawInterest,
  getDriverTrips,
  startTrip,
  completeTrip,
};

export default DriverService;
