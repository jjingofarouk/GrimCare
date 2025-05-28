import { API_ROUTES, BASE_URL } from '../api';

const mockDoctors = [
  {
    id: '1',
    name: 'Dr. Josephine Nakato',
    photo: '/doctors/jnakato.jpg',
    specialty: 'Cardiology',
    department: 'Cardiology Unit',
    ward: 'Ward A',
    email: 'j.nakato@mulago.go.ug',
    phone: '+256 700 123 456',
    designation: 'Consultant',
    qualifications: 'MBChB, MMed (Cardiology)',
    experience: '12',
    availabilityStatus: 'Available',
    hospital: 'Mulago National Referral Hospital',
    performance: { patientsToday: 10, admissions: 5, avgConsultTime: 15 },
  },
  {
    id: '2',
    name: 'Dr. Emmanuel Okello',
    photo: '/doctors/eokello.jpg',
    specialty: 'Pediatrics',
    department: 'Pediatrics Unit',
    ward: 'Ward B',
    email: 'e.okello@nsambya.go.ug',
    phone: '+256 712 987 654',
    designation: 'Registrar',
    qualifications: 'MBChB, MMed (Pediatrics)',
    experience: '8',
    availabilityStatus: 'In Consultation',
    hospital: 'Nsambya Hospital',
    performance: { patientsToday: 8, admissions: 3, avgConsultTime: 20 },
  },
];

const mockSchedules = [
  { id: '1', doctorId: '1', date: '2025-06-01', time: '08:00-11:00', type: 'Consultation', location: 'Cardiology Clinic' },
  { id: '2', doctorId: '1', date: '2025-06-01', time: '14:00-16:00', type: 'Surgery', location: 'Theatre 1' },
];

const mockPatients = [
  { id: 'p1', doctorId: '1', name: 'John Mukasa', type: 'Inpatient', ward: 'Ward A', recordId: 'r1' },
  { id: 'p2', doctorId: '1', name: 'Mary Nansamba', type: 'Outpatient', appointmentId: 'a1' },
];

const mockAppointments = [
  { id: 'a1', doctorId: '1', patientId: 'p2', date: '2025-06-01', time: '09:00', status: 'Confirmed' },
];

const mockPrescriptions = [
  { id: 'pr1', doctorId: '1', patientId: 'p1', drugs: ['Aspirin 75mg'], date: '2025-05-28', notes: 'Take daily' },
];

const mockCaseNotes = [
  { id: 'cn1', doctorId: '1', patientId: 'p1', note: 'Stable condition', visibility: 'Shared', date: '2025-05-28' },
];

const mockDiagnosticOrders = [
  { id: 'do1', doctorId: '1', patientId: 'p1', test: 'ECG', status: 'Pending', date: '2025-05-28' },
];

const mockLeaveRequests = [
  { id: 'lr1', doctorId: '1', startDate: '2025-06-10', endDate: '2025-06-12', status: 'Pending', leaveBalance: 10 },
];

export async function getDoctors() {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch doctors');
    return await response.json();
  } catch (error) {
    console.error(error);
    return mockDoctors;
  }
}

export async function getDoctorById(id) {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch doctor');
    return await response.json();
  } catch (error) {
    console.error(error);
    return mockDoctors.find((doctor) => doctor.id === id);
  }
}

export async function createDoctor(data) {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create doctor');
    return await response.json();
  } catch (error) {
    console.error(error);
    const newDoctor = { ...data, id: Math.random().toString(36).substr(2, 9), performance: { patientsToday: 0, admissions: 0, avgConsultTime: 0 } };
    mockDoctors.push(newDoctor);
    return newDoctor;
  }
}

export async function updateDoctor(id, data) {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update doctor');
    return await response.json();
  } catch (error) {
    console.error(error);
    const index = mockDoctors.findIndex((doctor) => doctor.id === id);
    if (index !== -1) {
      mockDoctors[index] = { ...mockDoctors[index], ...data };
      return mockDoctors[index];
    }
    throw new Error('Doctor not found');
  }
}

export async function deleteDoctor(id) {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to delete doctor');
    return await response.json();
  } catch (error) {
    console.error(error);
    const index = mockDoctors.findIndex((doctor) => doctor.id === id);
    if (index !== -1) {
      mockDoctors.splice(index, 1);
      return { success: true };
    }
    throw new Error('Doctor not found');
  }
}

export async function getDoctorSchedule(doctorId) {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${doctorId}/schedule`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch schedule');
    return await response.json();
  } catch (error) {
    console.error(error);
    return mockSchedules.filter((schedule) => schedule.doctorId === doctorId);
  }
}

export async function createSchedule(data) {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${data.doctorId}/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create schedule');
    return await response.json();
  } catch (error) {
    console.error(error);
    const newSchedule = { ...data, id: Math.random().toString(36).substr(2, 9) };
    mockSchedules.push(newSchedule);
    return newSchedule;
  }
}

export async function getAssignedPatients(doctorId) {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${doctorId}/patients`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch patients');
    return await response.json();
  } catch (error) {
    console.error(error);
    return mockPatients.filter((patient) => patient.doctorId === doctorId);
  }
}

export async function getAppointments(doctorId) {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${doctorId}/appointments`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return await response.json();
  } catch (error) {
    console.error(error);
    return mockAppointments.filter((appointment) => appointment.doctorId === doctorId);
  }
}

export async function updateAppointmentStatus(appointmentId, status) {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/appointments/${appointmentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update appointment');
    return await response.json();
  } catch (error) {
    console.error(error);
    const index = mockAppointments.findIndex((appt) => appt.id === appointmentId);
    if (index !== -1) {
      mockAppointments[index] = { ...mockAppointments[index], status };
      return mockAppointments[index];
    }
    throw new Error('Appointment not found');
  }
}

export async function createPrescription(data) {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/prescriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create prescription');
    return await response.json();
  } catch (error) {
    console.error(error);
    const newPrescription = { ...data, id: Math.random().toString(36).substr(2, 9) };
    mockPrescriptions.push(newPrescription);
    return newPrescription;
  }
}

export async function getPrescriptions(doctorId) {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${doctorId}/prescriptions`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch prescriptions');
    return await response.json();
  } catch (error) {
    console.error(error);
    return mockPrescriptions.filter((prescription) => prescription.doctorId === doctorId);
  }
}

export async function createCaseNote(data) {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/case-notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create case note');
    return await response.json();
  } catch (error) {
    console.error(error);
    const newCaseNote = { ...data, id: Math.random().toString(36).substr(2, 9), date: new Date().toISOString().split('T')[0] };
    mockCaseNotes.push(newCaseNote);
    return newCaseNote;
  }
}

export async function getCaseNotes(doctorId) {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${doctorId}/case-notes`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch case notes');
    return await response.json();
  } catch (error) {
    console.error(error);
    return mockCaseNotes.filter((note) => note.doctorId === doctorId);
  }
}

export async function createDiagnosticOrder(data) {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/diagnostic-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create diagnostic order');
    return await response.json();
  } catch (error) {
    console.error(error);
    const newOrder = { ...data, id: Math.random().toString(36).substr(2, 9), date: new Date().toISOString().split('T')[0], status: 'Pending' };
    mockDiagnosticOrders.push(newOrder);
    return newOrder;
  }
}

export async function getDiagnosticOrders(doctorId) {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${doctorId}/diagnostic-orders`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch diagnostic orders');
    return await response.json();
  } catch (error) {
    console.error(error);
    return mockDiagnosticOrders.filter((order) => order.doctorId === doctorId);
  }
}

export async function createLeaveRequest(data) {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/leave-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create leave request');
    return await response.json();
  } catch (error) {
    console.error(error);
    const newRequest = { ...data, id: Math.random().toString(36).substr(2, 9), status: 'Pending' };
    mockLeaveRequests.push(newRequest);
    return newRequest;
  }
}

export async function getLeaveRequests(doctorId) {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${doctorId}/leave-requests`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch leave requests');
    return await response.json();
  } catch (error) {
    console.error(error);
    return mockLeaveRequests.filter((request) => request.doctorId === doctorId);
  }
}

export async function getPerformanceSummary(doctorId, filters) {
  try {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${doctorId}/performance?${query}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch performance summary');
    return await response.json();
  } catch (error) {
    console.error(error);
    const doctor = mockDoctors.find((d) => d.id === doctorId);
    return doctor ? doctor.performance : {};
  }
}
