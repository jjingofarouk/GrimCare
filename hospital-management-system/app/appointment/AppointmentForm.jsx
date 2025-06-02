"use client";

import React, { useState, useEffect } from 'react';
import { getDoctors, getDoctorAvailability } from './appointmentService';
import styles from './AppointmentForm.module.css';

export default function AppointmentForm({ patients, onSuccess, appointment }) {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    department: '',
    date: '',
    status: 'SCHEDULED',
    reason: '',
    notes: '',
    type: 'REGULAR'
  });
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (err) {
        setError('Failed to fetch doctors');
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (appointment) {
      setFormData({
        patientId: appointment.patientId || '',
        doctorId: appointment.doctorId || '',
        department: appointment.department || '',
        date: appointment.date ? new Date(appointment.date).toISOString().slice(0, 16) : '',
        status: appointment.status || 'SCHEDULED',
        reason: appointment.reason || '',
        notes: appointment.notes || '',
        type: appointment.type || 'REGULAR'
      });
    }
  }, [appointment]);

  useEffect(() => {
    if (formData.doctorId && formData.date) {
      const fetchAvailability = async () => {
        try {
          const slots = await getDoctorAvailability(formData.doctorId, formData.date.split('T')[0]);
          setAvailableSlots(slots);
        } catch (err) {
          setError('Failed to fetch availability');
        }
      };
      fetchAvailability();
    }
  }, [formData.doctorId, formData.date]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.reason) {
      setError('All required fields must be filled.');
      return false;
    }
    const selectedDate = new Date(formData.date);
    if (selectedDate < new Date()) {
      setError('Cannot schedule appointments in the past.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirmation(true);
  };

  const confirmSubmission = async () => {
    setLoading(true);
    try {
      if (appointment) {
        await updateAppointment(appointment.id, formData);
      } else {
        await createAppointment(formData);
      }
      onSuccess();
      setFormData({ patientId: '', doctorId: '', department: '', date: '', status: 'SCHEDULED', reason: '', notes: '', type: 'REGULAR' });
      setShowConfirmation(false);
    } catch (err) {
      setError('Failed to process appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ patientId: '', doctorId: '', department: '', date: '', status: 'SCHEDULED', reason: '', notes: '', type: 'REGULAR' });
    setError(null);
    setShowConfirmation(false);
  };

  const reasons = ['Consultation', 'Follow-up', 'Emergency', 'Routine Checkup', 'Other'];
  const departments = ['General Medicine', 'Pediatrics', 'Cardiology', 'Gynecology', 'Internal Medicine'];
  const appointmentTypes = ['REGULAR', 'WALK_IN', 'EMERGENCY'];

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="patientId">Patient</label>
          <select id="patientId" name="patientId" value={formData.patientId} onChange={handleChange} required>
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>{patient.name}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="doctorId">Doctor</label>
          <select id="doctorId" name="doctorId" value={formData.doctorId} onChange={handleChange} required>
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>{doctor.name} ({doctor.specialization})</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="department">Department</label>
          <select id="department" name="department" value={formData.department} onChange={handleChange}>
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="date">Date</label>
          <input id="date" type="datetime-local" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className={styles.field}>
          <label htmlFor="type">Appointment Type</label>
          <select id="type" name="type" value={formData.type} onChange={handleChange} required>
            {appointmentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="reason">Reason for Appointment</label>
          <select id="reason" name="reason" value={formData.reason} onChange={handleChange} required>
            <option value="">Select Reason</option>
            {reasons.map((reason) => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="notes">Additional Notes</label>
          <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="4" />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Processing...' : appointment ? 'Update Appointment' : 'Create Appointment'}
          </button>
          <button type="button" className={`${styles.button} ${styles.cancel}`} onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
      {showConfirmation && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Confirm Appointment</h2>
            <p><strong>Patient:</strong> {patients.find(p => p.id === formData.patientId)?.name}</p>
            <p><strong>Doctor:</strong> {doctors.find(d => d.id === formData.doctorId)?.name}</p>
            <p><strong>Department:</strong> {formData.department}</p>
            <p><strong>Date:</strong> {new Date(formData.date).toLocaleString()}</p>
            <p><strong>Type:</strong> {formData.type}</p>
            <p><strong>Reason:</strong> {formData.reason}</p>
            <p><strong>Notes:</strong> {formData.notes || 'None'}</p>
            <div className={styles.buttonGroup}>
              <button className={styles.button} onClick={confirmSubmission} disabled={loading}>
                {loading ? 'Processing...' : 'Confirm'}
              </button>
              <button className={`${styles.button} ${styles.cancel}`} onClick={() => setShowConfirmation(false)} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}