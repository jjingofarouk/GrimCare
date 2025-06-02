import React from 'react';
import styles from './AppointmentCard.module.css';

export default function AppointmentCard({ appointment, onEdit, onCancel, onCheckIn, onCheckOut }) {
  const { id, patient, doctor, date, status, reason, notes, department, queuePosition, checkInTime, checkOutTime } = appointment;
  const formattedDate = new Date(date).toLocaleString();

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Appointment #{id}</h3>
      <p><strong>Patient:</strong> {patient.name}</p>
      <p><strong>Doctor:</strong> {doctor.name} ({doctor.specialization})</p>
      <p><strong>Department:</strong> {department || 'N/A'}</p>
      <p><strong>Date:</strong> {formattedDate}</p>
      <p><strong>Reason:</strong> {reason}</p>
      {notes && <p><strong>Notes:</strong> {notes}</p>}
      <p><strong>Status:</strong> {status}</p>
      {queuePosition && <p><strong>Queue Position:</strong> {queuePosition}</p>}
      {checkInTime && <p><strong>Check-In:</strong> {new Date(checkInTime).toLocaleString()}</p>}
      {checkOutTime && <p><strong>Check-Out:</strong> {new Date(checkOutTime).toLocaleString()}</p>}
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
            {status === 'SCHEDULED' && !checkInTime && (
              <button
                className={styles.checkInButton}
                onClick={() => onCheckIn(id)}
                aria-label={`Check-in appointment ${id}`}
              >
                Check In
              </button>
            )}
            {checkInTime && !checkOutTime && (
              <button
                className={styles.checkOutButton}
                onClick={() => onCheckOut(id)}
                aria-label={`Check-out appointment ${id}`}
              >
                Check Out
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}