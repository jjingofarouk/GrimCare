import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getUser, isAuthenticated } from '../../auth';
import bcrypt from 'bcryptjs';

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

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token || !isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = getUser();
    if (!user || !hasPermission(user.role, 'Doctor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const doctors = await prisma.doctor.findMany({
      include: { user: { select: { name: true, email: true } } },
    });
    return NextResponse.json(doctors);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(request) {
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
    const { email, name, password, ...doctorData } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'DOCTOR',
      },
    });
    const doctor = await prisma.doctor.create({
      data: {
        userId: newUser.id,
        ...doctorData,
      },
    });
    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}