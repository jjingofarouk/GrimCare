"use client" ;

import { useState } from 'react';
import styles from './AppointmentForm.module.css';
import { createAppointment } from './appointmentService';

export default function AppointmentForm({ patients, doctors, onSuccess }) {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    status: 'SCHEDULED',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAppointment(formData);
      onSuccess();
      setFormData({ patientId: '', doctorId: '', date: '', status: 'SCHEDULED' });
    } catch (err) {
      setError('Failed to create appointment');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Patient</label>
        <select name="patientId" value={formData.patientId} onChange={handleChange} required>
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>{patient.name}</option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label>Doctor</label>
        <select name="doctorId" value={formData.doctorId} onChange={handleChange} required>
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label>Date</label>
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button}>Create Appointment</button>
    </form>
  );
}