import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getUser, isAuthenticated } from '../../../auth';

const prisma = new PrismaClient();

const hasPermission = (role, feature) => {
  const rolePermissions = {
    PATIENT: ['Dashboard', 'Appointments', 'Medical Records', 'Billing'],
    DOCTOR: ['Dashboard', 'Patients', 'Appointments', 'Clinical', 'Operation Theatre'],
    NURSE: ['Dashboard', 'Patients', 'Appointments', 'Nursing', 'Maternity'],
    LAB_TECHNICIAN: ['Dashboard', 'Laboratory', 'Radiology'],
    STAFF: ['Dashboard', 'Helpdesk', 'Inventory', 'Procurement'],
    ADMIN: [
      'Dashboard',
      'Patients',
      'Appointments',
      'Accounting',
      'ADT',
      'Billing',
      'Claim Management',
      'Clinical',
      'Clinical Settings',
      'CSSD',
      'Dispensary',
      'Doctor',
      'Dynamic Report',
      'Emergency',
      'Fixed Assets',
      'Helpdesk',
      'Incentive',
      'Inventory',
      'Laboratory',
      'Maternity',
      'Medical Records',
      'Marketing Referral',
      'NHIF',
      'Nursing',
      'Operation Theatre',
      'Pharmacy',
      'Procurement',
      'Queue Management',
      'Radiology',
      'Reports',
      'Settings',
      'Social Service',
      'Substore',
      'System Admin',
      'Utilities',
      'Vaccination',
      'Verification',
    ],
  };

  return rolePermissions[role]?.includes(feature) || false;
};

export async function GET(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token || !isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = getUser();
    if (!user || !hasPermission(user.role, 'Doctor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(params.id) },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }
    return NextResponse.json(doctor);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token || !isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = getUser();
    if (!user || !hasPermission(user.role, 'Doctor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { email, name, ...doctorData } = data;

    // Update User if email or name provided
    if (email || name) {
      await prisma.user.update({
        where: { id: (await prisma.doctor.findUnique({ where: { id: parseInt(params.id) } })).userId },
        data: { email, name },
      });
    }

    // Update Doctor profile
    const doctor = await prisma.doctor.update({
      where: { id: parseInt(params.id) },
      data: doctorData,
    });
    return NextResponse.json(doctor);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token || !isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = getUser();
    if (!user || !hasPermission(user.role, 'Doctor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const doctor = await prisma.doctor.findUnique({ where: { id: parseInt(params.id) } });
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Delete associated User
    await prisma.user.delete({ where: { id: doctor.userId } });

    return NextResponse.json({ message: 'Doctor deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete doctor' }, { status: 500 });
  }
}