import { API_ROUTES, BASE_URL } from '../api';

const mockDoctors = [
  {
    id: '1',
    name: 'Dr. Josephine Nakato',
    specialty: 'Cardiology',
    department: 'Cardiology Unit',
    ward: 'Ward A',
    email: 'j.nakato@mulago.go.ug',
    phone: '+256 700 123 456',
    availability: true,
    qualifications: 'MBChB, MMed (Cardiology)',
    experience: '12',
    hospital: 'Mulago National Referral Hospital',
  },
  {
    id: '2',
    name: 'Dr. Emmanuel Okello',
    specialty: 'Pediatrics',
    department: 'Pediatrics Unit',
    ward: 'Ward B',
    email: 'e.okello@nsambya.go.ug',
    phone: '+256 712 987 654',
    availability: false,
    qualifications: 'MBChB, MMed (Pediatrics)',
    experience: '8',
    hospital: 'Nsambya Hospital',
  },
  {
    id: '3',
    name: 'Dr. Sarah Mbabazi',
    specialty: 'Orthopedics',
    department: 'Orthopedics Unit',
    ward: 'Ward C',
    email: 's.mbabazi@lubaga.go.ug',
    phone: '+256 771 456 789',
    availability: true,
    qualifications: 'MBChB, MMed (Orthopedics)',
    experience: '10',
    hospital: 'Lubaga Hospital',
  },
];

const mockSchedules = [
  {
    id: '1',
    doctorId: '1',
    date: '2025-06-01',
    time: '08:00-11:00',
    type: 'Consultation',
    location: 'Cardiology Clinic',
  },
  {
    id: '2',
    doctorId: '1',
    date: '2025-06-01',
    time: '14:00-16:00',
    type: 'Surgery',
    location: 'Theatre 1',
  },
  {
    id: '3',
    doctorId: '2',
    date: '2025-06-02',
    time: '09:00-12:00',
    type: 'Rounds',
    location: 'Pediatric Ward',
  },
];

export async function getDoctors() {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
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
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
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
    const newDoctor = { ...data, id: Math.random().toString(36).substr(2, 9), hospital: 'Mulago National Referral Hospital' };
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
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
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
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
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
