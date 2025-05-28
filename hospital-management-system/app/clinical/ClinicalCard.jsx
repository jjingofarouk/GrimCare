"use client";

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
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
    <Card className={styles.card}>
      <CardContent>
        <Typography variant="h6" className={styles.title}>
          Clinical Record #{id}
        </Typography>
        <Box className={styles.field}>
          <Typography>
            <strong>Patient:</strong> {patient.name} (Age: {patient.age}, Sex: {patient.gender})
          </Typography>
        </Box>
        <Box className={styles.field}>
          <Typography>
            <strong>Patient Type:</strong> {patientType.charAt(0).toUpperCase() + patientType.slice(1)}
          </Typography>
        </Box>
        <Box className={styles.field}>
          <Typography>
            <strong>Diagnosis:</strong> {diagnosis}
          </Typography>
        </Box>
        <Box className={styles.field}>
          <Typography>
            <strong>Treatment:</strong> {treatment}
          </Typography>
        </Box>
        {patientType === 'emergency' && (
          <Box className={styles.field}>
            <Typography>
              <strong>Triage Status:</strong> {triageStatus || '-'}
            </Typography>
          </Box>
        )}
        {patientType === 'inpatient' && (
          <>
            <Box className={styles.field}>
              <Typography>
                <strong>IP Number:</strong> {ipNumber || '-'}
              </Typography>
            </Box>
            <Box className={styles.field}>
              <Typography>
                <strong>Department:</strong> {department || '-'}
              </Typography>
            </Box>
            <Box className={styles.field}>
              <Typography>
                <strong>Admission Date:</strong> {formattedAdmissionDate}
              </Typography>
            </Box>
            <Box className={styles.field}>
              <Typography>
                <strong>Admitting Doctor:</strong> {admittingDoctor || '-'}
              </Typography>
            </Box>
            <Box className={styles.field}>
              <Typography>
                <strong>Status:</strong> {status.charAt(0).toUpperCase() + status.slice(1)}
              </Typography>
            </Box>
            {status === 'discharged' && (
              <>
                <Box className={styles.field}>
                  <Typography>
                    <strong>Discharge Date:</strong> {formattedDischargeDate}
                  </Typography>
                </Box>
                <Box className={styles.field}>
                  <Typography>
                    <strong>Discharging Doctor:</strong> {dischargingDoctor || '-'}
                  </Typography>
                </Box>
              </>
            )}
          </>
        )}
        {(patientType === 'emergency' || patientType === 'outpatient') && (
          <Box className={styles.field}>
            <Typography>
              <strong>Assigned Doctor:</strong> {assignedDoctor || '-'}
            </Typography>
          </Box>
        )}
        <Box className={styles.field}>
          <Typography>
            <strong>Recent Results:</strong> {recentResults || '-'}
          </Typography>
        </Box>
        <Box className={styles.field}>
          <Typography>
            <strong>Created:</strong> {formattedDate}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}