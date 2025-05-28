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
    'Social Service', 'Substore', 'System Admin', 'Utilities', 'Vaccination', 'Settings'
  ],
  NURSE: [
    'Dashboard', 'Patients', 'Appointments', 'Clinical', 'Maternity', 'Nursing',
    'Operation Theatre', 'Queue Management'
  ],
  DOCTOR: [
    'Dashboard', 'Patients', 'Appointments', 'Clinical', 'Medical Records',
    'Operation Theatre', 'Radiology', 'Laboratory'
  ],
  HELP_DESK: [
    'Dashboard', 'Helpdesk', 'Queue Management'
  ],
  LAB_TECHNICIAN: [
    'Dashboard', 'Laboratory', 'Radiology'
  ],
  USER: [
    'Dashboard', 'Patients', 'Appointments'
  ]
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const hasPermission = (userRole, featureName) => {
  return ROLE_PERMISSIONS[userRole]?.includes(featureName) || false;
};