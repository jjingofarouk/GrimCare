
// DoctorSchedule.jsx
import React, { useState, useEffect } from 'react';
import styles from './DoctorSchedule.module.css';
import AppointmentCard from './AppointmentCard';
import { getAppointments } from './appointmentService';

export default function DoctorSchedule({ doctorId }) {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        const doctorAppointments = data.filter((appt) => appt.doctor.id === doctorId && appt.status === 'SCHEDULED');
        setAppointments(doctorAppointments);
      } catch (err) {
        setError('Failed to fetch doctor schedule');
      }
    };
    fetchAppointments();
  }, [doctorId]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Doctor Schedule</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {appointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>
  );
}
