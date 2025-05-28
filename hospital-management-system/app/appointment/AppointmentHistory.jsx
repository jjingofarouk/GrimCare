
// AppointmentHistory.jsx
import React, { useState, useEffect } from 'react';
import styles from './AppointmentHistory.module.css';
import AppointmentCard from './AppointmentCard';
import { getAppointments } from './appointmentService';

export default function AppointmentHistory({ patientId }) {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const appointmentsPerPage = 5;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        const patientAppointments = data.filter((appt) => appt.patient.id === patientId);
        setAppointments(patientAppointments);
      } catch (err) {
        setError('Failed to fetch appointment history');
      }
    };
    fetchAppointments();
  }, [patientId]);

  const paginatedAppointments = appointments.slice((page - 1) * appointmentsPerPage, page * appointmentsPerPage);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Appointment History</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {paginatedAppointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
      <div className={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className={styles.pageButton}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          disabled={page * appointmentsPerPage >= appointments.length}
          onClick={() => setPage((prev) => prev + 1)}
          className={styles.pageButton}
        >
          Next
        </button>
      </div>
    </div>
  );
}
