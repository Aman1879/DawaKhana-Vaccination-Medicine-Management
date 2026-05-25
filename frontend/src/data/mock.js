export const vaccineData = [
  { id: 1, vaccine_name: 'Influenza Shield', category: 'Adult', stock: 126, expiry_date: '2026-12-18', batch_number: 'FLU-21-09', manufacturer: 'MediCore Labs' },
  { id: 2, vaccine_name: 'Pediatric Guard', category: 'Pediatric', stock: 38, expiry_date: '2026-08-03', batch_number: 'PED-11-77', manufacturer: 'Nova Health' },
  { id: 3, vaccine_name: 'Hepa Protect', category: 'Travel', stock: 21, expiry_date: '2026-06-12', batch_number: 'HEP-55-10', manufacturer: 'Astra Bio' },
];

export const ointmentData = [
  { id: 1, ointment_name: 'Derma Relief', type: 'Topical', stock: 87, expiry_date: '2026-11-01', manufacturer: 'SkinTide' },
  { id: 2, ointment_name: 'Burn Ease', type: 'First Aid', stock: 14, expiry_date: '2026-05-28', manufacturer: 'MediCore Labs' },
];

export const appointmentData = [
  { id: 1, user: 'Ava Thompson', date: '2026-05-16', time_slot: '09:00 - 09:30', status: 'approved' },
  { id: 2, user: 'Noah Patel', date: '2026-05-17', time_slot: '10:00 - 10:30', status: 'pending' },
  { id: 3, user: 'Elena Cruz', date: '2026-05-18', time_slot: '14:00 - 14:30', status: 'rejected' },
];

export const notificationData = [
  { id: 1, title: 'Low stock alert', message: 'Burn Ease is below the reorder threshold.', read_status: false },
  { id: 2, title: 'Reminder sent', message: 'Appointment reminder delivered to Noah Patel.', read_status: true },
];

export const analyticsData = [
  { name: 'Mon', vaccines: 18, ointments: 9, appointments: 12 },
  { name: 'Tue', vaccines: 24, ointments: 11, appointments: 15 },
  { name: 'Wed', vaccines: 12, ointments: 7, appointments: 8 },
  { name: 'Thu', vaccines: 30, ointments: 13, appointments: 18 },
  { name: 'Fri', vaccines: 22, ointments: 14, appointments: 16 },
  { name: 'Sat', vaccines: 16, ointments: 8, appointments: 11 },
];
