import { NextResponse } from 'next/server';
import { getAppointments, getPatients, getDoctors, getDepartments, createAppointment } from '../../appointmentService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get('resource');
  const doctorId = searchParams.get('doctorId');
  const patientId = searchParams.get('patientId');
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  try {
    if (resource === 'patients') {
      const patients = await getPatients();
      return NextResponse.json(patients);
    }
    if (resource === 'doctors') {
      const doctors = await getDoctors();
      return NextResponse.json(doctors);
    }
    if (resource === 'departments') {
      const departments = await getDepartments();
      return NextResponse.json(departments);
    }
    const appointments = await getAppointments({
      status,
      type,
      dateFrom,
      dateTo,
      doctorId,
      patientId,
    });
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const appointment = await createAppointment(data);
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}