"use client";

import React, { useState, useEffect } from "react";
import styles from "./AppointmentForm.module.css";
import { createAppointment, updateAppointment } from "./appointmentService";

export default function AppointmentForm({ patients, doctors, onSuccess, appointment }) {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    status: "SCHEDULED",
    reason: "",
    notes: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Prepopulate form for rebooking if appointment prop is provided
  useEffect(() => {
    if (appointment) {
      setFormData({
        patientId: appointment.patientId || "",
        doctorId: appointment.doctorId || "",
        date: appointment.date ? new Date(appointment.date).toISOString().slice(0, 16) : "",
        status: appointment.status || "SCHEDULED",
        reason: appointment.reason || "",
        notes: appointment.notes || "",
      });
    }
  }, [appointment]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.reason) {
      setError("All required fields must be filled.");
      return false;
    }
    const selectedDate = new Date(formData.date);
    if (selectedDate < new Date()) {
      setError("Cannot schedule appointments in the past.");
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
        // Rebooking: Update existing appointment
        await updateAppointment(appointment.id, formData);
      } else {
        // New booking: Create appointment
        await createAppointment(formData);
      }
      onSuccess();
      setFormData({ patientId: "", doctorId: "", date: "", status: "SCHEDULED", reason: "", notes: "" });
      setShowConfirmation(false);
    } catch (err) {
      setError("Failed to process appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ patientId: "", doctorId: "", date: "", status: "SCHEDULED", reason: "", notes: "" });
    setError(null);
    setShowConfirmation(false);
  };

  const reasons = [
    "Consultation",
    "Follow-up",
    "Emergency",
    "Routine Checkup",
    "Other",
  ];

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="patientId">Patient</label>
          <select
            id="patientId"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
            aria-required="true"
          >
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="doctorId">Doctor</label>
          <select
            id="doctorId"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            required
            aria-required="true"
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} {doctor.specialization ? `(${doctor.specialization})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="reason">Reason for Appointment</label>
          <select
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            aria-required="true"
          >
            <option value="">Select Reason</option>
            {reasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="notes">Additional Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            aria-describedby="notes-help"
          />
          <small id="notes-help">Optional: Add any additional details about the appointment.</small>
        </div>
        <div className={styles.field}>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Processing..." : appointment ? "Update Appointment" : "Create Appointment"}
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.cancel}`}
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>

      {showConfirmation && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Confirm Appointment</h2>
            <p>
              <strong>Patient:</strong>{" "}
              {patients.find((p) => p.id === formData.patientId)?.name}
            </p>
            <p>
              <strong>Doctor:</strong>{" "}
              {doctors.find((d) => d.id === formData.doctorId)?.name}
            </p>
            <p>
              <strong>Date:</strong> {new Date(formData.date).toLocaleString()}
            </p>
            <p>
              <strong>Reason:</strong> {formData.reason}
            </p>
            <p>
              <strong>Status:</strong> {formData.status}
            </p>
            <div className={styles.buttonGroup}>
              <button
                className={styles.button}
                onClick={confirmSubmission}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
              <button
                className={`${styles.button} ${styles.cancel}`}
                onClick={() => setShowConfirmation(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}