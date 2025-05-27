import styles from './AppointmentCard.module.css';

export default function AppointmentCard({ appointment }) {
  const { id, patient, doctor, date, status } = appointment;
  const formattedDate = new Date(date).toLocaleString();

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Appointment #{id}</h3>
      <p><strong>Patient:</strong> {patient.name}</p>
      <p><strong>Doctor:</strong> {doctor.name}</p>
      <p><strong>Date:</strong> {formattedDate}</p>
      <p><strong>Status:</strong> {status}</p>
    </div>
  );
}