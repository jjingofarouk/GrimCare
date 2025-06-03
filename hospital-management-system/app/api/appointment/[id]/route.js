import { NextResponse } from 'next/server';
import { updateAppointment } from '../../appointment/appointmentService';

export async function GET(request, { params }) {
  try {
    const appointment = await getAppointments({ id: params.id });
    if (!appointment.length) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    return NextResponse.json(appointment[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const appointment = await updateAppointment(params.id, data);
    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}