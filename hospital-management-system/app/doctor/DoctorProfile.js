'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Chip, Grid } from '@mui/material';
import * as doctorService from './doctorService';
import api from '../api';

const DoctorProfile = ({ doctorId }) => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data = await doctorService.getDoctorById(doctorId);
        setDoctor(data);
      } catch (error) {
        console.error('Failed to fetch doctor:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!doctor) {
    return <Typography>Doctor not found</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar src={doctor.photo || '/default-avatar.png'} sx={{ width: 100, height: 100, mr: 2 }} />
            <Box>
              <Typography variant="h5">{doctor.user.name}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {doctor.designation} - {doctor.specialty}
              </Typography>
              <Chip 
                label={doctor.availabilityStatus} 
                color={doctor.availabilityStatus === 'AVAILABLE' ? 'success' : 'error'} 
                size="small" 
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Email:</strong> {doctor.user.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Phone:</strong> {doctor.phone || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Department:</strong> {doctor.department}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Ward:</strong> {doctor.ward || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1"><strong>Qualifications:</strong> {doctor.qualifications || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1"><strong>Experience:</strong> {doctor.experience ? `${doctor.experience} years` : 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1"><strong>Hospital:</strong> {doctor.hospital}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DoctorProfile;
