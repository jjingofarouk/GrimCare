"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, CircularProgress, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchableSelect from '../components/SearchableSelect';
import axios from 'axios';
import api from '../api';
import styles from './Queue.module.css';

export default function QueueManagement({ doctors }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [queueItems, setQueueItems] = useState([]);
  const [filteredQueueItems, setFilteredQueueItems] = useState([]);
  const [filter, setFilter] = useState({ status: '', date: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all queue data on component mount
  useEffect(() => {
    async function fetchAllQueues() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        // Fetch queue data for all doctors by making individual requests
        const allQueueItems = [];

        for (const doctor of doctors) {
          try {
            const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=queue&doctorId=${doctor.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const doctorQueueItems = response.data.map((item, index) => ({
              id: item.id || `${doctor.id}-queue-${index + 1}`,
              patientName: item.appointment?.patient?.user?.name || item.appointment?.patient?.patientId || 'N/A',
              doctorName: doctor.user?.name || doctor.doctorId || 'Unknown Doctor',
              doctorId: doctor.id,
              queueNumber: item.queueNumber || 'N/A',
              status: item.status || 'WAITING',
              appointmentDate: item.appointment?.date ? new Date(item.appointment.date).toLocaleString() : 'N/A',
            }));
            allQueueItems.push(...doctorQueueItems);
          } catch (doctorErr) {
            // Skip doctors with no queue items or errors
            console.warn(`Failed to fetch queue for doctor ${doctor.id}:`, doctorErr.message);
          }
        }

        setQueueItems(allQueueItems);
        applyFilters(allQueueItems, filter, selectedDoctorId);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }

    if (doctors && doctors.length > 0) {
      fetchAllQueues();
    }
  }, [doctors]);

  // Apply filters when doctor selection or other filters change
  const applyFilters = (data, currentFilter, doctorId) => {
    let filtered = [...data];

    // Filter by selected doctor
    if (doctorId) {
      filtered = filtered.filter(item => item.doctorId === parseInt(doctorId));
    }

    // Filter by status
    if (currentFilter.status) {
      filtered = filtered.filter(item => item.status === currentFilter.status);
    }

    // Filter by date
    if (currentFilter.date) {
      const filterDate = new Date(currentFilter.date).toDateString();
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.appointmentDate).toDateString();
        return itemDate === filterDate;
      });
    }

    setFilteredQueueItems(filtered);
  };

  useEffect(() => {
    applyFilters(queueItems, filter, selectedDoctorId);
  }, [filter, queueItems, selectedDoctorId]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}/${id}`, {
        resource: 'queue',
        status: newStatus,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedQueueItems = queueItems.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      );
      setQueueItems(updatedQueueItems);
      applyFilters(updatedQueueItems, filter, selectedDoctorId);
      setError(null);
    } catch (err) {
      setError('Failed to update queue status: ' + (err.response?.data?.error || err.message));
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'patientName', headerName: 'Patient', width: 150 },
    { field: 'doctorName', headerName: 'Doctor', width: 150 },
    { field: 'queueNumber', headerName: 'Queue Number', width: 120 },
    { field: 'appointmentDate', headerName: 'Appointment Date', width: 200 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box className={styles.actions}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleStatusUpdate(params.row.id, 'IN_PROGRESS')}
            disabled={params.row.status !== 'WAITING'}
            className={styles.actionButton}
          >
            Start
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleStatusUpdate(params.row.id, 'COMPLETED')}
            disabled={params.row.status !== 'IN_PROGRESS'}
            className={styles.actionButton}
          >
            Complete
          </Button>
        </Box>
      ),