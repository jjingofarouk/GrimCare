'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Tabs, Tab, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, MenuItem, Avatar } from '@mui/material';
import * as doctorService from './doctorService';
import ScheduleForm from './ScheduleForm';
import PrescriptionForm from './PrescriptionForm';
import CaseNoteForm from './CaseNoteForm';
import DiagnosticOrderForm from './DiagnosticOrderForm';
import LeaveRequestForm from './LeaveRequestForm';
import api from '../api';

const DoctorDetails = ({ doctorId, initialTab = 0 }) => {
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [tabValue, setTabValue] = useState(initialTab);
  const [schedules, setSchedules] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [caseNotes, setCaseNotes] = useState([]);
  const [diagnosticOrders, setDiagnosticOrders] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [performance, setPerformance] = useState({});
  const [openScheduleForm, setOpenScheduleForm] = useState(false);
  const [openPrescriptionForm, setOpenPrescriptionForm] = useState(false);
  const [openCaseNoteForm, setOpenCaseNoteForm] = useState(false);
  const [openDiagnosticForm, setOpenDiagnosticForm] = useState(false);
  const [openLeaveForm, setOpenLeaveForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorData = await doctorService.getDoctorById(doctorId);
        const scheduleData = await doctorService.getDoctorSchedule(doctorId);
        const patientData = await doctorService.getAssignedPatients(doctorId);
        const appointmentData = await doctorService.getAppointments(doctorId);
        const prescriptionData = await doctorService.getPrescriptions(doctorId);
        const caseNoteData = await doctorService.getCaseNotes(doctorId);
        const diagnosticData = await doctorService.getDiagnosticOrders(doctorId);
        const leaveData = await doctorService.getLeaveRequests(doctorId);
        const performanceData = await doctorService.getPerformanceSummary(doctorId, { period: 'week' });
        setDoctor(doctorData);
        setSchedules(scheduleData);
        setPatients(patientData);
        setAppointments(appointmentData);
        setPrescriptions(prescriptionData);
        setCaseNotes(caseNoteData);
        setDiagnosticOrders(diagnosticData);
        setLeaveRequests(leaveData);
        setPerformance(performanceData);
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      }
    };
    fetchData();
  }, [doctorId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddSchedule = async (schedule) => {
    try {
      const newSchedule = await doctorService.createSchedule({ ...schedule, doctorId });
      setSchedules([...schedules, newSchedule]);
      setOpenScheduleForm(false);
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  const handleAddPrescription = async (prescription) => {
    try {
      const newPrescription = await doctorService.createPrescription({ ...prescription, doctorId });
      setPrescriptions([...prescriptions, newPrescription]);
      setOpenPrescriptionForm(false);
    } catch (error) {
      console.error('Error adding prescription:', error);
    }
  };

  const handleAddCaseNote = async (caseNote) => {
    try {
      const newCaseNote = await doctorService.createCaseNote({ ...caseNote, doctorId });
      setCaseNotes([...caseNotes, newCaseNote]);
      setOpenCaseNoteForm(false);
    } catch (error) {
      console.error('Error adding case note:', error);
    }
  };

  const handleAddDiagnosticOrder = async (order) => {
    try {
      const newOrder = await doctorService.createDiagnosticOrder({ ...order, doctorId });
      setDiagnosticOrders([...diagnosticOrders, newOrder]);
      setOpenDiagnosticForm(false);
    } catch (error) {
      console.error('Error adding diagnostic order:', error);
    }
  };

  const handleAddLeaveRequest = async (request) => {
    try {
      const newRequest = await doctorService.createLeaveRequest({ ...request, doctorId });
      setLeaveRequests([...leaveRequests, newRequest]);
      setOpenLeaveForm(false);
    } catch (error) {
      console.error('Error adding leave request:', error);
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId, status) => {
    try {
      const updated = await doctorService.updateAppointmentStatus(appointmentId, status);
      setAppointments(appointments.map((appt) => appt.id === appointmentId ? updated : appt));
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const handleViewPatient = (patientRecordId) => {
    router.push(`${api.API_ROUTES.PATIENT}/${patientRecordId}`);
  };

  if (!doctor) return <Typography>Loading...</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {doctor.user.name} - Details
      </Typography>
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar src={doctor.photo} sx={{ width: 80, height: 80, mr: 2 }} />
        <Box>
          <Typography variant="h6">
            {doctor.user.name} ({doctor.designation})
          </Typography>
          <Typography variant="body1">
            {doctor.specialty} - {doctor.department}
          </Typography>
          <Typography variant="body2">
            {doctor.user.email} | {doctor.phone}
          </Typography>
          <Typography variant="body2">
            Qualifications: {doctor.qualifications}
          </Typography>
          <Typography variant="body2">
            Experience: {doctor.experience} years
          </Typography>
        </Box>
      </Box>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Schedule" />
        <Tab label="Patients" />
        <Tab label="Appointments" />
        <Tab label="Prescriptions" />
        <Tab label="Case Notes" />
        <Tab label="Diagnostic Orders" />
        <Tab label="Leave Requests" />
        <Tab label="Performance" />
      </Tabs>
      {tabValue === 0 && (
        <Box>
          <Button variant="contained" onClick={() => setOpenScheduleForm(true)} sx={{ mb: 2 }}>
            Add Schedule
          </Button>
          {openScheduleForm && <ScheduleForm onSave={handleAddSchedule} onCancel={() => setOpenScheduleForm(false)} />}
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>{new Date(schedule.date).toLocaleDateString()}</TableCell>
                    <TableCell>{schedule.time}</TableCell>
                    <TableCell>{schedule.type}</TableCell>
                    <TableCell>{schedule.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}
      {tabValue === 1 && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.user.name}</TableCell>
                  <TableCell>{patient.type}</TableCell>
                  <TableCell>{patient.ward || 'OPD'}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleViewPatient(patient.recordId)}>
                      View Record
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
      {tabValue === 2 && (
        <Box>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell>{appt.patient.user.name}</TableCell>
                    <TableCell>{new Date(appt.date).toLocaleDateString()}</TableCell>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell>{appt.status}</TableCell>
                    <TableCell>
                      <TextField
                        select
                        value={appt.status}
                        onChange={(e) => handleUpdateAppointmentStatus(appt.id, e.target.value)}
                        size="small"
                      >
                        {['CONFIRMED', 'PENDING', 'CANCELLED', 'SEEN', 'NO_SHOW', 'FOLLOW_UP'].map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}
      {tabValue === 3 && (
        <Box>
          <Button variant="contained" onClick={() => setOpenPrescriptionForm(true)} sx={{ mb: 2 }}>
            Add Prescription
          </Button>
          {openPrescriptionForm && <PrescriptionForm onSave={handleAddPrescription} onCancel={() => setOpenPrescriptionForm(false)} patients={patients} />}
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Drugs</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell>{prescription.patient.user.name}</TableCell>
                    <TableCell>{prescription.drugs.join(', ')}</TableCell>
                    <TableCell>{new Date(prescription.date).toLocaleDateString()}</TableCell>
                    <TableCell>{prescription.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}
      {tabValue === 4 && (
        <Box>
          <Button variant="contained" onClick={() => setOpenCaseNoteForm(true)} sx={{ mb: 2 }}>
            Add Case Note
          </Button>
          {openCaseNoteForm && <CaseNoteForm onClose={() => setOpenCaseNoteForm(false)} onSave={handleAddCaseNote} patients={patients} />}
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Visibility</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {caseNotes.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell>{note.patient.user.name}</TableCell>
                    <TableCell>{note.note}</TableCell>
                    <TableCell>{note.visibility}</TableCell>
                    <TableCell>{new Date(note.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}
      {tabValue === 5 && (
        <Box>
          <Button variant="contained" onClick={() => setOpenDiagnosticForm(true)} sx={{ mb: 2 }}>
            Add Diagnostic Order
          </Button>
          {openDiagnosticForm && <DiagnosticOrderForm onSave={handleAddDiagnosticOrder} onCancel={() => setOpenDiagnosticForm(false)} patients={patients} />}
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Test</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {diagnosticOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.patient.user.name}</TableCell>
                    <TableCell>{order.test}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}
      {tabValue === 6 && (
        <Box>
          <Button variant="contained" onClick={() => setOpenLeaveForm(true)} sx={{ mb: 2 }}>
            Request Leave
          </Button>
          {openLeaveForm && <LeaveRequestForm onSave={handleAddLeaveRequest} onCancel={() => setOpenLeaveForm(false)} />}
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Leave Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{new Date(request.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(request.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>{request.leaveBalance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}
      {tabValue === 7 && (
        <Box>
          <Typography variant="h6">Performance Summary</Typography>
          <Typography>Patients Seen Today: {performance.patientsToday}</Typography>
          <Typography>Admissions: {performance.admissions}</Typography>
          <Typography>Average Consultation Time: {performance.avgConsultTime} minutes</Typography>
        </Box>
      )}
    </Box>
  );
};

export default DoctorDetails;