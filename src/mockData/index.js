export const mockUsers = {
  agent: {
    id: 'agent-001',
    name: 'Priya Sharma',
    email: 'priya@travels.co',
    phone: '+91 98765 43210',
    company: 'Horizon Travel Agency',
    role: 'agent',
  },
  driver: {
    id: 'driver-001',
    name: 'Ravi Kumar',
    email: 'ravi.driver@taxiconnect.app',
    phone: '+91 91234 56780',
    licenseNumber: 'DL-09-2020-112233',
    role: 'driver',
  },
  owner: {
    id: 'owner-001',
    name: 'Amit Verma',
    email: 'amit@fleetpro.in',
    phone: '+91 99887 76655',
    company: 'FleetPro Mobility',
    fleetSize: 24,
    role: 'owner',
  },
};

export const mockBookings = [
  {
    id: 'BK-1001',
    title: 'Airport Transfer — Delhi',
    pickup: 'Connaught Place, New Delhi',
    drop: 'IGI Airport T3',
    date: '2026-09-18',
    time: '06:30 AM',
    vehicleType: 'sedan',
    passengers: 2,
    status: 'open',
    budget: 1800,
  },
  {
    id: 'BK-1002',
    title: 'Corporate Outstation',
    pickup: 'Gurgaon Cyber Hub',
    drop: 'Jaipur',
    date: '2026-09-20',
    time: '08:00 AM',
    vehicleType: 'innova',
    passengers: 5,
    status: 'quoted',
    budget: 9500,
  },
];

export default {
  mockUsers,
  mockBookings,
};
