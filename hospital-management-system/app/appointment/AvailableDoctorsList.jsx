import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, TextField, Button, styled } from '@mui/material';
import CustomDataGrid from '../components/CustomDataGrid';
import axios from 'axios';
import api from '../api';

export default function AvailableDoctorsList() {
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=doctors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const doctorsData = await Promise.all(
          response.data.map(async (doctor) => {
            const availabilityResponse = await axios.get(
              `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=availability&doctorId=${doctor.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return {
              id: doctor.id, // Ensure unique id for DataGrid
              user: doctor.user || { name: 'N/A' }, // Fallback for user
              specialty: doctor.specialty || 'N/A', // Fallback for specialty
              availability: availabilityResponse.data.filter(
                (item) => item && item.startTime && item.endTime && item.status === 'AVAILABLE'
              ) || [],
            };
          })
        );
        setDoctors(doctorsData);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
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

  const filteredDoctors = doctors.map((doctor) => ({
    ...doctor,
    availability: dateFilter.startDate && dateFilter.endDate
      ? doctor.availability.filter(
          (slot) =>
            new Date(slot.startTime) >= new Date(dateFilter.startDate) &&
            new Date(slot.endTime) <= new Date(dateFilter.endDate)
        )
      : doctor.availability,
  }));

  const columns = [
    { 
      field: 'doctorName', 
      headerName: 'Doctor Name', 
      width: 200, 
      valueGetter: (params) => params.row.user?.name || 'N/A' 
    },
    { 
      field: 'specialty', 
      headerName: 'Specialty', 
      width: 150,
      valueGetter: (params) => params.row.specialty || 'N/A'
    },
    {
      field: 'availabilityStatus',
      headerName: 'Availability',
      width: 150,
      valueGetter: (params) => (params.row.availability?.length > 0 ? 'Available' : 'Not Available'),
    },
    {
      field: 'availableSlots',
      headerName: 'Available Time Slots',
      width: 400,
      valueGetter: (params) => {
        const slots = params.row.availability || [];
        return slots.length > 0
          ? slots
              .map((slot) => `${new Date(slot.startTime).toLocaleString()} - ${new Date(slot.endTime).toLocaleString()}`)
              .join(', ')
          : 'No available slots';
      },
    },
  ];

  const ModernBox = styled(Box)(({ theme }) => ({
    width: '100vw',
    minHeight: '100vh',
    padding: '2rem',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
  }));

  const ModernTypography = styled(Typography)(({ theme }) => ({
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '2rem',
    textAlign: 'center',
    background: 'linear-gradient(45deg, #00b0ff, #80d8ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 4px rgba(0, 123, 255, 0.3)',
  }));

  const ModernFilterContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '1200px',
  }));

  const ModernTextField = styled(TextField)(({ theme }) => ({
    minWidth: '200px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.15)',
      },
      '&.Mui-focused': {
        background: 'rgba(255, 255, 255, 0.2)',
        boxShadow: '0 0 15px rgba(0, 123, 255, 0.3)',
      },
      '& input': {
        color: '#fff',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
      '&.Mui-focused': {
        color: '#00b0ff',
      },
    },
  }));

  const ModernButton = styled(Button)(({ theme }) => ({
    borderRadius: '12px',
    padding: '10px 24px',
    background: 'linear-gradient(45deg, #00b0ff, #0052cc)',
    color: '#fff',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 4px 15px rgba(0, 123, 255, 0.4)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(45deg, #00d4ff, #0073e6)',
      boxShadow: '0 6px 20px rgba(0, 123, 255, 0.6)',
      transform: 'translateY(-2px)',
    },
  }));

  const ModernAlert = styled(Alert)(({ theme }) => ({
    marginBottom: '1rem',
    borderRadius: '12px',
    background: 'rgba(255, 75, 75, 0.1)',
    backdropFilter: 'blur(10px)',
    color: '#ff6b6b',
    width: '100%',
    maxWidth: '1200px',
  }));

  const ModernGridContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: '1200px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '1rem',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  }));

  return (
    <ModernBox>
      <ModernTypography variant="h5">Available Doctors</ModernTypography>
      <ModernFilterContainer>
        <ModernTextField
          label="Start Date"
          type="date"
          name="startDate"
          value={dateFilter.startDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
        />
        <ModernTextField
          label="End Date"
          type="date"
          name="endDate"
          value={dateFilter.endDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
        />
        <ModernButton onClick={handleFilter}>Filter</ModernButton>
      </ModernFilterContainer>
      {error && <ModernAlert severity="error">{error}</ModernAlert>}
      {loading ? (
        <CircularProgress />
      ) : (
        <ModernGridContainer>
          <CustomDataGrid rows={filteredDoctors} columns={columns} getRowId={(row) => row.id} />
        </ModernGridContainer>
      )}
    </ModernBox>
  );
}