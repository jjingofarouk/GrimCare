// clinical/ClinicalForm.jsx
'use client';
import React, { useState } from 'react';
import styles from './ClinicalForm.module.css';
import { createClinicalRecord } from './clinicalService';

export default function ClinicalForm({ patients, onSuccess }) {
  const [formData, setFormData] = useState({
    patientId: '',
    diagnosis: '',
    treatment: '',
    patientType: 'outpatient', // outpatient, inpatient, or emergency
    triageStatus: '', // for ER: critical, emergency, urgent, semi-urgent, non-urgent
    admissionDate: '',
    ipNumber: '',
    department: '',
    admittingDoctor: '',
    dischargeDate: '',
    dischargingDoctor: '',
    assignedDoctor: '',
    recentResults: '',
    status: 'active', // active, admitted, discharged
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createClinicalRecord(formData);
      onSuccess();
      setFormData({
        patientId: '',
        diagnosis: '',
        treatment: '',
        patientType: 'outpatient',
        triageStatus: '',
        admissionDate: '',
        ipNumber: '',
        department: '',
        admittingDoctor: '',
        dischargeDate: '',
        dischargingDoctor: '',
        assignedDoctor: '',
        recentResults: '',
        status: 'active',
      });
    } catch (err) {
      setError('Failed to create clinical record');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Patient</label>
        <select name="patientId" value={formData.patientId} onChange={handleChange} required>
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label>Patient Type</label>
        <select name="patientType" value={formData.patientType} onChange={handleChange} required>
          <option value="outpatient">Outpatient</option>
          <option value="inpatient">Inpatient</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>
      {formData.patientType === 'emergency' && (
        <div className={styles.field}>
          <label>Triage Status</label>
          <select name="triageStatus" value={formData.triageStatus} onChange={handleChange} required>
            <option value="">Select Triage Status</option>
            <option value="critical">Critical</option>
            <option value="emergency">Emergency</option>
            <option value="urgent">Urgent</option>
            <option value="semi-urgent">Semi-Urgent</option>
            <option value="non-urgent">Non-Urgent</option>
          </select>
        </div>
      )}
      <div className={styles.field}>
        <label>Diagnosis</label>
        <input
          type="text"
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label>Treatment</label>
        <textarea
          name="treatment"
          value={formData.treatment}
          onChange={handleChange}
          required
        />
      </div>
      {formData.patientType === 'inpatient' && (
        <>
          <div className={styles.field}>
            <label>Admission Date</label>
            <input
              type="date"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label>IP Number</label>
            <input
              type="text"
              name="ipNumber"
              value={formData.ipNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Admitting Doctor</label>
            <input
              type="text"
              name="admittingDoctor"
              value={formData.admittingDoctor}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="active">Active</option>
              <option value="admitted">Admitted</option>
              <option value="discharged">Discharged</option>
            </select>
          </div>
          {formData.status === 'discharged' && (
            <>
              <div className={styles.field}>
                <label>Discharge Date</label>
                <input
                  type="date"
                  name="dischargeDate"
                  value={formData.dischargeDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Discharging Doctor</label>
                <input
                  type="text"
                  name="dischargingDoctor"
                  value={formData.dischargingDoctor}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
        </>
      )}
      {(formData.patientType === 'emergency' || formData.patientType === 'outpatient') && (
        <div className={styles.field}>
          <label>Assigned Doctor</label>
          <input
            type="text"
            name="assignedDoctor"
            value={formData.assignedDoctor}
            onChange={handleChange}
            required
          />
        </div>
      )}
      <div className={styles.field}>
        <label>Recent Results</label>
        <textarea
          name="recentResults"
          value={formData.recentResults}
          onChange={handleChange}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button}>
        Create Record
      </button>
    </form>
  );
}
