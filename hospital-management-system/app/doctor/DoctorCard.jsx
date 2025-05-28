'use client';
import React from 'react';
import { Card, CardContent, Typography, Chip, Avatar, Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import styles from './DoctorCard.module.css';

const DoctorCard = ({ doctor, onEdit, onDelete }) => {
  const router = useRouter();

  return (
    <Card className={styles.card}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar>{doctor.name?.[0] || '?'}</Avatar>
          <Box ml={2}>
            <Typography variant="h6">{doctor.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {doctor.specialty}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2">
          <strong>Department:</strong> {doctor.department}
        </Typography>
        <Typography variant="body2">
          <strong>Ward:</strong> {doctor.ward}
        </Typography>
        <Typography variant="body2">
          <strong>Email:</strong> {doctor.email}
        </Typography>
        <Typography variant="body2">
          <strong>Phone:</strong> {doctor.phone}
        </Typography>
        <Typography variant="body2">
          <strong>Status:</strong>{' '}
          <Chip
            label={doctor.availability ? 'Available' : 'Unavailable'}
            color={doctor.availability ? 'success' : 'error'}
            size="small"
          />
        </Typography>

        <Box mt={2} display="flex" gap={1}>
          <Button variant="outlined" size="small" onClick={() => onEdit(doctor)}>
            Edit
          </Button>
          <Button variant="outlined" color="error" size="small" onClick={() => onDelete(doctor.id)}>
            Delete
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => router.push(`/doctors/${doctor.id}/schedule`)}
          >
            View Schedule
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;