import React from 'react';
import { Card, CardContent, Typography, Chip, Button, Box } from '@mui/material';
import { AccessTime, Person, MedicalServices, Schedule } from '@mui/icons-material';

export default function AppointmentCard({ appointment, onEdit, onCancel, onCheckIn, onCheckOut }) {
  const { id, patient, doctor, appointmentDate, status, type, reason, queueNumber, checkInTime, checkOutTime } = appointment;
  const formattedDate = new Date(appointmentDate).toLocaleString();

  return (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Appointment #{id}</Typography>
          <Chip label={status} color={status === 'SCHEDULED' ? 'primary' : status === 'COMPLETED' ? 'success' : 'error'} />
        </Box>
        <Box mt={2}>
          <Typography><Person fontSize="small" /> Patient: {patient.user.name}</Typography>
          <Typography><MedicalServices fontSize="small" /> Doctor: {doctor.user.name} ({doctor.specialty})</Typography>
          <Typography><AccessTime fontSize="small" /> Date: {formattedDate}</Typography>
          <Typography>Reason: {reason}</Typography>
          <Typography>Type: {type}</Typography>
          {queueNumber && <Typography>Queue #: {queueNumber}</Typography>}
          {checkInTime && <Typography>Check-in: {new Date(checkInTime).toLocaleString()}</Typography>}
          {checkOutTime && <Typography>Check-out: {new Date(checkOutTime).toLocaleString()}</Typography>}
        </Box>
        {status !== 'CANCELLED' && status !== 'COMPLETED' && (
          <Box mt={2} display="flex" gap={1}>
            <Button variant="outlined" onClick={() => onEdit(appointment)}>Edit</Button>
            <Button variant="outlined" color="error" onClick={() => onCancel(id)}>Cancel</Button>
            {!checkInTime && <Button variant="contained" onClick={() => onCheckIn(id)}>Check In</Button>}
            {checkInTime && !checkOutTime && <Button variant="contained" onClick={() => onCheckOut(id)}>Check Out</Button>}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
