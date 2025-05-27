import React from 'react';
import AppointmentList from './AppointmentList';
import AppointmentForm from './AppointmentForm';

// Mock data for demo (replace with API calls in production)
const patients = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
];
const doctors = [
  { id: 1, name: 'Dr. Alice Brown' },
  { id: 2, name: 'Dr. Bob White' },
];

export default function AppointmentPage() {
  const handleSuccess = () => {
    // Refresh appointments or update state
    console.log('Appointment created');
  };

  return (
    <div>
      <AppointmentForm patients={patients} doctors={doctors} onSuccess={handleSuccess} />
      <AppointmentList />
    </div>
  );
}