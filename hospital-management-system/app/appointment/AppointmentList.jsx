import { useState, useEffect } from 'react';
import styles from './AppointmentList.module.css';
import AppointmentCard from './AppointmentCard';
import { getAppointments } from './appointmentService';

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

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

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Appointments</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {appointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>
  );
}