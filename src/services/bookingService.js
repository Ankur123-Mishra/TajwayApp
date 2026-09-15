import {BOOKING_STATUS, STORAGE_KEYS} from '../constants/AppConstants';
import {mockBookings} from '../mockData';
import {storage} from '../utils/storage';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

const clone = value => JSON.parse(JSON.stringify(value));

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

export async function createBooking(payload = {}) {
  await delay();
  const bookings = await loadBookings();
  const booking = {
    id: payload.id || `TC-BK-${Date.now()}`,
    agentId: payload.agentId || null,
    agentName: payload.agentName || '',
    agentBusiness: payload.agentBusiness || '',
    agentRating: payload.agentRating || 0,
    pickupCity: payload.pickupCity || '',
    dropCity: payload.dropCity || '',
    pickup: payload.pickup || '',
    drop: payload.drop || '',
    date: payload.date || '',
    time: payload.time || '',
    returnDate: payload.returnDate || null,
    returnTime: payload.returnTime || null,
    tripType: payload.tripType || 'One Way',
    vehicleType: payload.vehicleType || 'Sedan',
    passengers: payload.passengers || 1,
    adults: payload.adults || payload.passengers || 1,
    children: payload.children || 0,
    luggage: payload.luggage || 0,
    budget: payload.budget || 0,
    requirements: payload.requirements || [],
    status: payload.status || BOOKING_STATUS.POSTED,
    interestedCount: 0,
    interestedDrivers: [],
    selectedDriverId: null,
    notes: payload.notes || '',
    extraRequirements: payload.extraRequirements || '',
    secured: !!payload.secured,
  };
  bookings.unshift(booking);
  await saveBookings(bookings);
  return booking;
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
  getBookings,
  updateBooking,
  selectDriver,
  cancelBooking,
};

export default BookingService;
