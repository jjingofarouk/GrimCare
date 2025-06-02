"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Alert, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AppointmentFilter from "./AppointmentFilter";
import { getAppointments, updateAppointment } from "./appointmentService";
import { format } from "date-fns";

export default function AppointmentList({ onEdit }) {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ status: "ALL", dateFrom: "", dateTo: "", doctorId: "", patientId: "", type: "ALL" });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(Array.isArray(data) ? data.filter((item) => item && item.id) : []);
      } catch (err) {
        setError("Failed to fetch appointments");
        console.error("Fetch appointments error:", err);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    try {
      await updateAppointment(id, { status: "CANCELLED" });
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status: "CANCELLED" } : appt))
      );
    } catch (err) {
      setError("Failed to cancel appointment");
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
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
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
      width: 150,
      valueGetter: (params) => params?.row?.patient?.user?.name ?? "N/A",
    },
    {
      field: "doctorName",
      headerName: "Doctor",
      width: 150,
      valueGetter: (params) => params?.row?.doctor?.user?.name ?? "N/A",
    },
    {
      field: "date",
      headerName: "Date",
      width: 200,
      valueGetter: (params) => {
        try {
          return params?.row?.date ? format(new Date(params.row.date), "PPp") : "N/A";
        } catch {
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
      valueGetter: (params) => params?.row?.queue?.queueNumber ?? "N/A",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onEdit(params.row)}
            disabled={params?.row?.status === "CANCELLED" || params?.row?.status === "CHECKED_OUT"}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleCancel(params.row.id)}
            disabled={params?.row?.status === "CANCELLED" || params?.row?.status === "CHECKED_OUT"}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleCheckIn(params.row.id)}
            disabled={params?.row?.status !== "SCHEDULED"}
          >
            Check In
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleCheckOut(params.row.id)}
            disabled={params?.row?.status !== "CHECKED_IN"}
          >
            Check Out
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Appointments</Typography>
      <AppointmentFilter onFilter={setFilter} />
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={filteredAppointments}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}