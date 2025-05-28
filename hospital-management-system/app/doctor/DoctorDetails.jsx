'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Tabs, Tab, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, MenuItem, Avatar } from '@mui/material';
import * as doctorService from './doctorService';
import ScheduleForm from './ScheduleForm';
import PrescriptionForm from './PrescriptionForm';
import CaseNoteForm from './CaseNoteForm';
import DiagnosticOrderForm from './DiagnosticOrderForm';
import LeaveRequestForm from './LeaveRequestForm';

const mockPatients = [
  { id: 1, name: 'John Doe', type: 'Inpatient', ward: 'Ward A', recordId: '1' },
  { id: 2, name: 'Jane Smith', type: 'Outpatient', recordId: '2' },
];

const DoctorDetails = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [tabValue, setTabValue] = useState(0);
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
    };
    fetchData();
  }, [doctorId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddSchedule = async (schedule) => {
    const newSchedule = await doctorService.createSchedule({ ...schedule, doctorId });
    setSchedules([...schedules, newSchedule]);
    setOpenScheduleForm(false);
  };

  const handleAddPrescription = async (prescription) => {
    const newPrescription = await doctorService.createPrescription({ ...prescription, doctorId });
    setPrescriptions([...prescriptions, newPrescription]);
    setOpenPrescriptionForm(false);
  };

  const handleAddCaseNote = async (caseNote) => {
    const newCaseNote = await doctorService.createCaseNote({ ...caseNote, doctorId });
    setCaseNotes([...caseNotes, newCaseNote]);
    setOpenCaseNoteForm(false);
  };

  const handleAddDiagnosticOrder = async (order) => {
    const newOrder = await doctorService.createDiagnosticOrder({ ...order, doctorId });
    setDiagnosticOrders([...diagnosticOrders, newOrder]);
    setOpenDiagnosticForm(false);
  };

  const handleAddLeaveRequest = async (request) => {
    const newRequest = await doctorService.createLeaveRequest({ ...request, doctorId });
    setLeaveRequests([...leaveRequests, newRequest]);
    setOpenLeaveForm(false);
  };

  const handleUpdateAppointmentStatus = async (appointmentId, status) => {
    const updated = await doctorService.updateAppointmentStatus(appointmentId, status);
    setAppointments(appointments.map((appt) => appt.id === appointmentId ? updated : appt));
  };

  if (!doctor) return null;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>{doctor.name} - Details</Typography>
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar src={doctor.photo} sx={{ width: 80, height: 80, mr: 2 }} />
        <Box>
          <Typography variant="h6">{doctor.name} ({doctor.designation})</Typography>
          <Typography variant="body1">{doctor.specialty} - {doctor.department}</Typography>
          <Typography variant="body2">{doctor.email} | {doctor.phone}</Typography>
          <Typography variant="body2">Qualifications: {doctor.qualifications}</Typography>
          <Typography variant="body2">Experience: {doctor.experience} years</Typography>
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
                    <TableCell>{schedule.date}</TableCell>
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
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.type}</TableCell>
                  <TableCell>{patient.ward || 'OPD'}</TableCell>
                  <TableCell>
                    <Button onClick={() => navigate(`/patients/${patient.recordId}`)}>
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
                    <TableCell>{mockPatients.find((p) => p.id === appt.patientId)?.name || 'Unknown'}</TableCell>
                    <TableCell>{appt.date}</TableCell>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell>{appt.status}</TableCell>
                    <TableCell>
                      <TextField
                        select
                        value={appt.status}
                        onChange={(e) => handleUpdateAppointmentStatus(appt.id, e.target.value)}
                        size="small"
                      >
                        {['Confirmed', 'Pending', 'Cancelled', 'Seen', 'No-Show', 'Follow-Up'].map((option) => (
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
                    <TableCell>{mockPatients.find((p) => p.id === prescription.patientId)?.name || 'Unknown'}</TableCell>
                    <TableCell>{prescription.drugs.join(', ')}</TableCell>
                    <TableCell>{prescription.date}</TableCell>
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
          {openCaseNoteForm && <CaseNoteForm onSave={handleAddCaseNote} onCancel={() => setOpenCaseNoteForm(false)} patients={patients} />}
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
                    <TableCell>{mockPatients.find((p) => p.id === note.patientId)?.name || 'Unknown'}</TableCell>
                    <TableCell>{note.note}</TableCell>
                    <TableCell>{note.visibility}</TableCell>
                    <TableCell>{note.date}</TableCell>
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
                    <TableCell>{mockPatients.find((p) => p.id === order.patientId)?.name || 'Unknown'}</TableCell>
                    <TableCell>{order.test}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.date}</TableCell>
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
                    <TableCell>{request.startDate}</TableCell>
                    <TableCell>{request.endDate}</TableCell>
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