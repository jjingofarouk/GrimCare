
// AppointmentList.jsx
"use client";

import React, { useState, useEffect } from 'react';
import styles from './AppointmentList.module.css';
import AppointmentCard from './AppointmentCard';
import AppointmentFilter from './AppointmentFilter';
import { getAppointments, updateAppointment } from './appointmentService';

export default function AppointmentList({ onEdit }) {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ status: 'ALL', dateFrom: '', dateTo: '', doctorId: '', patientId: '' });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (err) {
        setError('Failed to fetch appointments');
      }
    };
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    try {
      await updateAppointment(id, { status: 'CANCELLED' });
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status: 'CANCELLED' } : appt))
      );
    } catch (err) {
      setError('Failed to cancel appointment');
    }
  };

  const handleFilter = (newFilters) => {
    setFilter(newFilters);
  };

  const filteredAppointments = appointments.filter((appt) => {
    const matchesStatus = filter.status === 'ALL' || appt.status === filter.status;
    const matchesDateFrom = !filter.dateFrom || new Date(appt.date) >= new Date(filter.dateFrom);
    const matchesDateTo = !filter.dateTo || new Date(appt.date) <= new Date(filter.dateTo);
    const matchesDoctor = !filter.doctorId || appt.doctor.id === filter.doctorId;
    const matchesPatient = !filter.patientId || appt.patient.id === filter.patientId;
    return matchesStatus && matchesDateFrom && matchesDateTo && matchesDoctor && matchesPatient;
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Appointments</h2>
      <AppointmentFilter onFilter={handleFilter} />
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {filteredAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onEdit={onEdit}
            onCancel={handleCancel}
          />
        ))}
      </div>
    </div>
  );
}
