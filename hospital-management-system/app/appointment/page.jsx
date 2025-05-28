
// AppointmentPage.jsx
"use client";

import React, { useState, useEffect } from 'react';
import AppointmentList from './AppointmentList';
import AppointmentForm from './AppointmentForm';
import AppointmentConfirmation from './AppointmentConfirmation';
import { getAppointments } from './appointmentService';

export default function AppointmentPage() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(null);

  useEffect(() => {
    // Mock API calls for patients and doctors
    const fetchData = async () => {
      try {
        // Replace with actual API calls
        setPatients([
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Smith' },
        ]);
        setDoctors([
          { id: 1, name: 'Dr. Alice Brown', specialization: 'Cardiology' },
          { id: 2, name: 'Dr. Bob White', specialization: 'Neurology' },
        ]);
      } catch (err) {
        console.error('Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  const handleSuccess = (appointment) => {
    setSelectedAppointment(null);
    setShowConfirmation(appointment);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
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
      {showConfirmation && (
        <AppointmentConfirmation
          appointment={showConfirmation}
          onClose={() => setShowConfirmation(null)}
        />
      )}
    </div>
  );
}
