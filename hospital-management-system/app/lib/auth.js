import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  NURSE: 'NURSE',
  DOCTOR: 'DOCTOR',
  HELP_DESK: 'HELP_DESK',
  LAB_TECHNICIAN: 'LAB_TECHNICIAN',
};

export const ROLE_PERMISSIONS = {
  ADMIN: [
    'Dashboard', 'Patients', 'Appointments', 'Accounting', 'ADT', 'Billing',
    'Claim Management', 'Clinical', 'CSSD', 'Dispensary', 'Doctor', 'Emergency',
    'Fixed Assets', 'Helpdesk', 'Incentive', 'Inventory', 'Laboratory', 'Maternity',
    'Medical Records', 'Marketing Referral', 'NHIF', 'Nursing', 'Operation Theatre',
    'Pharmacy', 'Procurement', 'Queue Management', 'Radiology', 'Reports',
    'Social Service', 'Substore', 'System Admin', 'Utilities', 'Vaccination',
    'Profile', 'Settings', 'Clinical Settings', 'System Admin'
  ],
  NURSE: [
    'Dashboard', 'Patients', 'Appointments', 'Clinical', 'Maternity', 'Nursing',
    'Operation Theatre', 'Queue Management', 'Profile', 'Settings'
  ],
  DOCTOR: [
    'Dashboard', 'Patients', 'Appointments', 'Clinical', 'Medical Records',
    'Operation Theatre', 'Radiology', 'Laboratory', 'Profile', 'Settings', 'Clinical Settings'
  ],
  HELP_DESK: [
    'Dashboard', 'Helpdesk', 'Queue Management', 'Profile', 'Settings'
  ],
  LAB_TECHNICIAN: [
    'Dashboard', 'Laboratory', 'Radiology', 'Profile', 'Settings'
  ],
  USER: [
    'Dashboard', 'Patients', 'Appointments', 'Profile', 'Settings'
  ]
};

export const ROLE_REDIRECTS = {
  ADMIN: '/system-admin',
  NURSE: '/nursing',
  DOCTOR: '/clinical',
  HELP_DESK: '/helpdesk',
  LAB_TECHNICIAN: '/laboratory',
  USER: '/dashboard'
};

export const hasPermission = (userRole, featureName) => {
  console.log(`Checking permission for role: ${userRole}, feature: ${featureName}`);
  return ROLE_PERMISSIONS[userRole]?.includes(featureName) || false;
};

export const getCurrentUser = async (uid) => {
  console.log('Starting getCurrentUser with uid:', uid);
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(uid) } });
    if (!user) {
      console.log('User not found for ID:', uid);
      throw new Error('User not found');
    }
    if (!Object.values(ROLES).includes(user.role)) {
      console.error(`Invalid role for user ${user.id}: ${user.role}`);
      throw new Error('Invalid user role');
    }
    console.log('User fetched:', { id: user.id, email: user.email, name: user.name, role: user.role });
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  } catch (error) {
    console.error('getCurrentUser error:', error.message);
    throw error;
  }
};

export const getRoleRedirect = (role) => {
  console.log('Getting redirect for role:', role);
  if (!Object.values(ROLES).includes(role)) {
    console.warn(`Invalid role: ${role}, defaulting to /dashboard`);
    return '/dashboard';
  }
  return ROLE_REDIRECTS[role] || '/dashboard';
};