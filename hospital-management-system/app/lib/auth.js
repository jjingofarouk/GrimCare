import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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
    'Operation Theatre', 'Radiology', 'Laboratory', 'Profile', 'Settings'
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

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const hasPermission = (userRole, featureName) => {
  return ROLE_PERMISSIONS[userRole]?.includes(featureName) || false;
};

export const verifyToken = async (token) => {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.exp * 1000 < Date.now()) {
      return null;
    }
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const getRoleRedirect = (role) => {
  return ROLE_REDIRECTS[role] || '/dashboard';
};

export const getCurrentUser = async (token) => {
  try {
    console.log("Verifying token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      throw new Error("User not found");
    }
    console.log("Fetched user:", user);
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  } catch (error) {
    console.error("getCurrentUser error:", error.message);
    throw new Error("Invalid token");
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
  } catch (error) {
    console.error("loginUser error:", error.message);
    throw new Error(error.message || "Login failed");
  }
};

export const registerUser = async ({ email, password, name, role }) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || "USER",
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
  } catch (error) {
    console.error("registerUser error:", error.message);
    throw new Error(error.message || "Registration failed");
  }
};