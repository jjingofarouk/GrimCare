
// clinical/ClinicalCard.jsx
'use client';
import React from 'react';
import styles from './ClinicalCard.module.css';

export default function ClinicalCard({ record }) {
  const {
    id,
    patient,
    diagnosis,
    treatment,
    createdAt,
    patientType,
    triageStatus,
    admissionDate,
    ipNumber,
    department,
    admittingDoctor,
    dischargeDate,
    dischargingDoctor,
    assignedDoctor,
    recentResults,
    status,
  } = record;
  const formattedDate = new Date(createdAt).toLocaleString();
  const formattedAdmissionDate = admissionDate ? new Date(admissionDate).toLocaleDateString() : '-';
  const formattedDischargeDate = dischargeDate ? new Date(dischargeDate).toLocaleDateString() : '-';

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Clinical Record #{id}</h3>
      <p><strong>Patient:</strong> {patient.name} (Age: {patient.age}, Sex: {patient.gender})</p>
      <p><strong>Patient Type:</strong> {patientType.charAt(0).toUpperCase() + patientType.slice(1)}</p>
      <p><strong>Diagnosis:</strong> {diagnosis}</p>
      <p><strong>Treatment:</strong> {treatment}</p>
      {patientType === 'emergency' && <p><strong>Triage Status:</strong> {triageStatus || '-'}</p>}
      {patientType === 'inpatient' && (
        <>
          <p><strong>IP Number:</strong> {ipNumber || '-'}</p>
          <p><strong>Department:</strong> {department || '-'}</p>
          <p><strong>Admission Date:</strong> {formattedAdmissionDate}</p>
          <p><strong>Admitting Doctor:</strong> {admittingDoctor || '-'}</p>
          <p><strong>Status:</strong> {status.charAt(0).toUpperCase() + status.slice(1)}</p>
          {status === 'discharged' && (
            <>
              <p><strong>Discharge Date:</strong> {formattedDischargeDate}</p>
              <p><strong>Discharging Doctor:</strong> {dischargingDoctor || '-'}</p>
            </>
          )}
        </>
      )}
      {(patientType === 'emergency' || patientType === 'outpatient') && (
        <p><strong>Assigned Doctor:</strong> {assignedDoctor || '-'}</p>
      )}
      <p><strong>Recent Results:</strong> {recentResults || '-'}</p>
      <p><strong>Created:</strong> {formattedDate}</p>
    </div>
  );
}
