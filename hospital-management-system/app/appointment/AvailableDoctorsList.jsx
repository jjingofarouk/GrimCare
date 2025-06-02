"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, TextField, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getDoctors, getAvailability } from './appointmentService';
import { format, parseISO } from 'date-fns';
import styles from 'Availability.module.css';

export default function AvailableDoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const fetchDoctorsAndAvailability = async () => {
      try {
        const doctorsData = await getDoctors();
        const validDoctors = Array.isArray(doctorsData) ? doctorsData.filter(item => item && item.id) : [];
        
        const doctorsWithAvailability = await Promise.all(validDoctors.map(async (doctor) => {
          try {
            const data = await getAvailability({ doctorId: doctor.id });
            const validAvailability = Array.isArray(data)
              ? data.filter(
                  item => item && item.startTime && item.endTime && !isNaN(new Date(item.startTime)) && item.status === 'AVAILABLE'
                )
              : [];
            return { ...doctor, availability: validAvailability };
          } catch (err) {
            return { ...doctor, availability: [] };
          }
        }));
        
        setDoctors(doctorsWithAvailability);
      } catch (err) {
        setError('Failed to fetch doctors or availability');
        console.error('Fetch error:', err);
      }
    };
    fetchDoctorsAndAvailability();
  }, []);

  const handleDateChange = (e) => {
    setDateFilter({ ...dateFilter, [e.target.name]: e.target.value });
  };

  const handleFilter = () => {
    if (!dateFilter.startDate || !dateFilter.endDate) {
      setError('Please select a date range');
      return;
    }
    setError(null);
  };

  const filteredDoctors = doctors.map(doctor => ({
    ...doctor,
    availability: dateFilter.startDate && dateFilter.endDate
      ? doctor.availability.filter(
          slot => 
            parseISO(slot.startTime) >= parseISO(dateFilter.startDate) &&
            parseISO(slot.endTime) <= parseISO(dateFilter.endDate)
        )
      : doctor.availability
  }));

  const columns = [
    {
      field: 'doctorName',
      headerName: 'Doctor Name',
      width: 200,
      valueGetter: (params) => params?.row?.user?.name ?? 'N/A',
    },
    {
      field: 'specialty',
      headerName: 'Specialty',
      width: 150,
      valueGetter: (params) => params?.row?.specialty ?? 'N/A',
    },
    {
      field: 'availabilityStatus',
      headerName: 'Availability',
      width: 150,
      valueGetter: (params) => params?.row?.availability?.length > 0 ? 'Available' : 'Not Available',
    },
    {
      field: 'availableSlots',
      headerName: 'Available Time Slots',
      width: 400,
      valueGetter: (params) => {
        const slots = params?.row?.availability ?? [];
        return slots.length > 0
          ? slots
              .map(
                (slot) =>
                  `${format(parseISO(slot.startTime), 'PPp')} - ${format(parseISO(slot.endTime), 'PPp')}`
              )
              .join(', ')
          : 'No available slots';
      },
    },
  ];

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Available Doctors</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Start Date"
          type="date"
          name="startDate"
          value={dateFilter.startDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          name="endDate"
          value={dateFilter.endDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={handleFilter}>
          Filter
        </Button>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredDoctors}
          columns={columns}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}