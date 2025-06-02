import React, { useState, useEffect } from "react";
import { Box, Typography, Alert, Button, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AppointmentFilter from "./AppointmentFilter";
import { getAppointments, updateAppointment, getPatients, getDoctors } from "./appointmentService";
import { format } from "date-fns";
import styles from './list.module.css';

export default function AppointmentList({ onEdit }) {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "ALL", dateFrom: "", plannen: "", doctorId: "", patientId: "", type: "ALL" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const [appointmentsData, patientsData, doctorsData] = await Promise.all([
          getAppointments(),
          getPatients(),
          getDoctors(),
        ]);
        console.log('Fetched appointments:', JSON.stringify(appointmentsData, null, 2));
        console.log('Fetched patients:', JSON.stringify(patientsData, null, 2));
        console.log('Fetched doctors:', JSON.stringify(doctorsData, null, 2));

        const validAppointments = Array.isArray(appointmentsData)
          ? appointmentsData.filter((item) => {
              if (!item || typeof item !== 'object' || !item.id) {
                console.warn('Invalid appointment:', item);
                return false;
              }
              if (!item.patient?.user || !item.doctor?.user) {
                console.warn('Appointment missing patient.user or doctor.user:', item);
                return true; // Keep for now to debug
              }
              return true;
            })
          : [];
        const validPatients = Array.isArray(patientsData)
          ? patientsData.filter((item) => item && typeof item === 'object' && item.id && item.user)
          : [];
        const validDoctors = Array.isArray(doctorsData)
          ? doctorsData.filter((item) => item && typeof item === 'object' && item.id && item.user)
          : [];

        if (validAppointments.length !== appointmentsData.length) {
          console.warn('Invalid appointments filtered out:', appointmentsData.length - validAppointments.length);
        }

        setAppointments(validAppointments);
        setPatients(validPatients);
        setDoctors(validDoctors);
      } catch (err) {
        setError("Failed to fetch data: " + err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCancel = async (id) => {
    try {
      await updateAppointment(id, { status: "CANCELLED" });
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status: "CANCELLED" } : appt))
      );
    } catch (err) {
      setError("Failed to cancel appointment");
      console.error("Cancel error:", err);
    }
  };

  const handleCheckIn = async (id) => {
    try {
      await updateAppointment(id, { status: "CHECKED_IN", checkInTime: new Date() });
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status: "CHECKED_IN", checkInTime: new Date() } : appt))
      );
    } catch (err) {
      setError("Failed to check in appointment");
      console.error("Check-in error:", err);
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await updateAppointment(id, { status: "CHECKED_OUT", checkOutTime: new Date() });
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status: "CHECKED_OUT", checkOutTime: new Date() } : appt))
      );
    } catch (err) {
      setError("Failed to check out appointment");
      console.error("Check-out error:", err);
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (!appt || !appt.id) {
      console.warn('Invalid appointment in filter:', appt);
      return false;
    }
    const matchesStatus = filter.status === "ALL" || appt.status === filter.status;
    const matchesDateFrom = !filter.dateFrom || new Date(appt.date) >= new Date(filter.dateFrom);
    const matchesDateTo = !filter.dateTo || new Date(appt.date) <= new Date(filter.dateTo);
    const matchesDoctor = !filter.doctorId || appt.doctorId === parseInt(filter.doctorId);
    const matchesPatient = !filter.patientId || appt.patientId === parseInt(filter.patientId);
    const matchesType = filter.type === "ALL" || appt.type === filter.type;
    return matchesStatus && matchesDateFrom && matchesDateTo && matchesDoctor && matchesPatient && matchesType;
  });

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "patientName",
      headerName: "Patient",
      width: 200,
      valueGetter: (params) => {
        if (!params?.row) {
          console.error('params.row is undefined:', params);
          return "N/A";
        }
        const patient = params.row.patient;
        const name = patient?.user?.name ?? (patient?.name || "N/A");
        if (name === "N/A") console.error('Patient name missing for appointment:', JSON.stringify(params.row, null, 2));
        return name;
      },
    },
    {
      field: "doctorName",
      headerName: "Doctor",
      width: 200,
      valueGetter: (params) => {
        if (!params?.row) {
          console.error('params.row is undefined:', params);
          return "N/A";
        }
        const doctor = params.row.doctor;
        const name = doctor?.user?.name ?? (doctor?.name || "N/A");
        if (name === "N/A") console.error('Doctor name missing for appointment:', JSON.stringify(params.row, null, 2));
        return name;
      },
    },
    {
      field: "date",
      headerName: "Date",
      width: 200,
      valueGetter: (params) => {
        if (!params?.row) {
          console.error('params.row is undefined:', params);
          return "N/A";
        }
        try {
          const date = params.row.date ? format(new Date(params.row.date), "PPp") : "N/A";
          if (date === "N/A") console.error('Date missing for appointment:', JSON.stringify(params.row, null, 2));
          return date;
        } catch (err) {
          console.error('Date parsing error:', err);
          return "N/A";
        }
      },
    },
    { field: "type", headerName: "Type", width: 120 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "reason", headerName: "Reason", width: 150 },
    {
      field: "queueNumber",
      headerName: "Queue",
      width: 100,
      valueGetter: (params) => {
        if (!params?.row) {
          console.error('params.row is undefined:', params);
          return "N/A";
        }
        const queue = params.row.queue?.queueNumber ?? "N/A";
        if (queue === "N/A") console.error('Queue number missing for appointment:', JSON.stringify(params.row, null, 2));
        return queue;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => {
        if (!params?.row) {
          console.error('params.row is undefined in renderCell:', params);
          return null;
        }
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => onEdit(params.row)}
              disabled={params.row.status === "CANCELLED" || params.row.status === "CHECKED_OUT"}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleCancel(params.row.id)}
              disabled={params.row.status === "CANCELLED" || params.row.status === "CHECKED_OUT"}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleCheckIn(params.row.id)}
              disabled={params.row.status !== "SCHEDULED"}
            >
              Check In
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleCheckOut(params.row.id)}
              disabled={params.row.status !== "CHECKED_IN"}
            >
              Check Out
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Appointments</Typography>
      <AppointmentFilter onFilter={setFilter} patients={patients} doctors={doctors} />
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredAppointments}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
          />
        </Box>
      )}
    </Box>
  );
}