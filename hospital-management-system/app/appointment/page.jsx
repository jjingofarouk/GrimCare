"use client";

import React, { useState } from 'react';
import AppointmentList from './AppointmentList';
import AppointmentForm from './AppointmentForm';
import { getAppointments } from './appointmentService';

// Mock data for demo (replace with API calls in production)
const patients = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
];
const doctors = [
  { id: 1, name: 'Dr. Alice Brown', specialization: 'Cardiology' },
  { id: 2, name: 'Dr. Bob White', specialization: 'Neurology' },
];

export default function AppointmentPage() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setSelectedAppointment(null); // Clear form after success
    setRefreshKey((prev) => prev + 1); // Trigger list refresh
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment); // Set form to edit mode
  };

  return (
    <div>
      <AppointmentForm
        patients={patients}
        doctors={doctors}
        onSuccess={handleSuccess}
        appointment={selectedAppointment}
      />
      <AppointmentList key={refreshKey} onEdit={handleEdit} />
    </div>
  );
}