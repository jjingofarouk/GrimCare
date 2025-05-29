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
  return false; // Not used in middleware; rely on cookies
};

export const getToken = () => {
  return null; // Not used; tokens are handled via cookies
};

export const hasPermission = (userRole, featureName) => {
  console.log(`Checking permission for role: ${userRole}, feature: ${featureName}`);
  return ROLE_PERMISSIONS[userRole]?.includes(featureName) || false;
};

export const verifyToken = async (token) => {
  console.log("Verifying token:", token);
  try {
    if (!token) {
      console.log("No token provided");
      throw new Error("No token provided");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", decoded);
    if (decoded.exp * 1000 < Date.now()) {
      console.log("Token expired");
      throw new Error("Token expired");
    }
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error.message, error.stack);
    throw error;
  }
};

export const getRoleRedirect = (role) => {
  console.log("Getting redirect for role:", role);
  return ROLE_REDIRECTS[role] || '/dashboard';
};

export const getCurrentUser = async (token) => {
  console.log("Starting getCurrentUser with token:", token);
  try {
    const decoded = await verifyToken(token);
    console.log("Decoded token in getCurrentUser:", decoded);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      console.log("User not found for ID:", decoded.userId);
      throw new Error("User not found");
    }
    console.log("User fetched:", user);
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  } catch (error) {
    console.error("getCurrentUser error:", error.message, error.stack);
    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  console.log("Starting loginUser for:", email);
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("User not found for email:", email);
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password for user:", email);
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("Login token generated:", token);
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
  } catch (error) {
    console.error("loginUser error:", error.message, error.stack);
    throw new Error(error.message || "Login failed");
  }
};

export const registerUser = async ({ email, password, name, role }) => {
  console.log("Starting registerUser for:", email);
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log("User already exists:", email);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed for:", email);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || "USER",
      },
    });
    console.log("User created:", user);

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("Register token generated:", token);
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
  } catch (error) {
    console.error("registerUser error:", error.message, error.stack);
    throw new Error(error.message || "Registration failed");
  }
};