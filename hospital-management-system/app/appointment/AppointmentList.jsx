"use client";

import React, { useState, useEffect } from 'react';
import styles from './AppointmentList.module.css';
import AppointmentCard from './AppointmentCard';
import { getAppointments, updateAppointment } from './appointmentService';

export default function AppointmentList({ onEdit }) {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');

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
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: 'CANCELLED' } : appt
        )
      );
    } catch (err) {
      setError('Failed to cancel appointment');
    }
  };

  const filteredAppointments = filter === 'ALL'
    ? appointments
    : appointments.filter((appt) => appt.status === filter);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Appointments</h2>
      <div className={styles.filter}>
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select
          id="statusFilter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
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