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
    admissionDate, 
    ipNumber, 
    age, 
    sex, 
    department, 
    admittingDoctor, 
    dischargeDate, 
    dischargingDoctor, 
    triageStatus, 
    assignedDoctor 
  } = record;
  const formattedDate = new Date(createdAt).toLocaleString();
  const formattedAdmissionDate = admissionDate ? new Date(admissionDate).toLocaleString() : 'N/A';
  const formattedDischargeDate = dischargeDate ? new Date(dischargeDate).toLocaleString() : 'N/A';

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Clinical Record #{id} ({patientType})</h3>
      <p><strong>Patient:</strong> {patient.name}</p>
      <p><strong>Diagnosis:</strong> {diagnosis}</p>
      <p><strong>Treatment:</strong> {treatment}</p>
      {patientType === 'inpatient' && (
        <>
          <p><strong>Admission Date:</strong> {formattedAdmissionDate}</p>
          <p><strong>IP Number:</strong> {ipNumber}</p>
          <p><strong>Age:</strong> {age}</p>
          <p><strong>Sex:</strong> {sex}</p>
          <p><strong>Department:</strong> {department}</p>
          <p><strong>Admitting Doctor:</strong> {admittingDoctor}</p>
          <p><strong>Discharge Date:</strong> {formattedDischargeDate}</p>
          <p><strong>Discharging Doctor:</strong> {dischargingDoctor || 'N/A'}</p>
        </>
      )}
      {patientType === 'emergency' && (
        <>
          <p><strong>Triage Status:</strong> {triageStatus}</p>
          <p><strong>Assigned Doctor:</strong> {assignedDoctor}</p>
        </>
      )}
      <p><strong>Created:</strong> {formattedDate}</p>
    </div>
  );
}
