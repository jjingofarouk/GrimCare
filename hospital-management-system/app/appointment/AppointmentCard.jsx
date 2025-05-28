import React from 'react';
import styles from './AppointmentCard.module.css';

export default function AppointmentCard({ appointment, onEdit, onCancel }) {
  const { id, patient, doctor, date, status, reason, notes } = appointment;
  const formattedDate = new Date(date).toLocaleString();

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Appointment #{id}</h3>
      <p><strong>Patient:</strong> {patient.name}</p>
      <p><strong>Doctor:</strong> {doctor.name}</p>
      <p><strong>Date:</strong> {formattedDate}</p>
      <p><strong>Reason:</strong> {reason}</p>
      {notes && <p><strong>Notes:</strong> {notes}</p>}
      <p><strong>Status:</strong> {status}</p>
      <div className={styles.buttonGroup}>
        {status !== 'CANCELLED' && (
          <>
            <button
              className={styles.editButton}
              onClick={() => onEdit(appointment)}
              aria-label={`Edit appointment ${id}`}
            >
              Edit
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => onCancel(id)}
              aria-label={`Cancel appointment ${id}`}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}