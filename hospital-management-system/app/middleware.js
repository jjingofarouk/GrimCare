// app/middleware.js
import { NextResponse } from 'next/server';
import { hasPermission } from './lib/auth';
import jwt from 'jsonwebtoken';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  console.log(`Middleware: Path=${pathname}, Token=${token ? '[present]' : 'none'}, JWT_SECRET=${process.env.JWT_SECRET ? '[present]' : 'missing'}`);

  // Validate JWT_SECRET
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET environment variable is missing');
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Public routes
  const publicRoutes = ['/auth', '/api/auth', '/'];
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check token presence
  if (!token) {
    console.warn(`No token found, redirecting to /auth for path: ${pathname}`);
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`Middleware: Token decoded, role=${decoded.role}`);
    const userRole = decoded.role;

    // Route to feature mapping
    const routeToFeatureMap = {
      '/dashboard': 'Dashboard',
      '/patient': 'Patients',
      '/appointment': 'Appointments',
      '/accounting': 'Accounting',
      '/adt': 'ADT',
      '/billing': 'Billing',
      '/claim-mgmt': 'Claim Management',
      '/clinical': 'Clinical',
      '/cssd': 'CSSD',
      '/dispensary': 'Dispensary',
      '/doctor': 'Doctor',
      '/emergency': 'Emergency',
      '/fixed-assets': 'Fixed Assets',
      '/helpdesk': 'Helpdesk',
      '/incentive': 'Incentive',
      '/inventory': 'Inventory',
      '/laboratory': 'Laboratory',
      '/maternity': 'Maternity',
      '/medical-records': 'Medical Records',
      '/mkt-referral': 'Marketing Referral',
      '/nhif': 'NHIF',
      '/nursing': 'Nursing',
      '/operation-theatre': 'Operation Theatre',
      '/pharmacy': 'Pharmacy',
      '/procurement': 'Procurement',
      '/queue-mgmt': 'Queue Management', // Fixed typo
      '/radiology': 'Radiology',
      '/reports': 'Reports',
      '/social-service': 'Social Service',
      '/substore': 'Substore',
      '/system-admin': 'System Admin',
      '/utilities': 'Utilities',
      '/vaccination': 'Vaccination',
      '/settings': 'Settings',
    };

    const featureName = Object.keys(routeToFeatureMap).find((route) =>
      pathname.startsWith(route)
    );

    // Check permissions
    if (featureName && !hasPermission(userRole, routeToFeatureMap[featureName])) {
      console.warn(`User role ${userRole} lacks permission for ${featureName}, redirecting to /dashboard`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error(`Middleware error: ${error.message}, redirecting to /auth`);
    return NextResponse.redirect(new URL('/auth', request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/patient/:path*',
    '/appointment/:path*',
    '/accounting/:path*',
    '/adt/:path*',
    '/billing/:path*',
    '/claim-mgmt/:path*',
    '/clinical/:path*',
    '/cssd/:path*',
    '/dispensary/:path*',
    '/doctor/:path*',
    '/emergency/:path*',
    '/fixed-assets/:path*',
    '/helpdesk/:path*',
    '/incentive/:path*',
    '/inventory/:path*',
    '/laboratory/:path*',
    '/maternity/:path*',
    '/medical-records/:path*',
    '/mkt-referral/:path*',
    '/nhif/:path*',
    '/nursing/:path*',
    '/operation-theatre/:path*',
    '/pharmacy/:path*',
    '/procurement/:path*',
    '/queue-mgmt/:path*', // Fixed typo
    '/radiology/:path*',
    '/reports/:path*',
    '/social-service/:path*',
    '/substore/:path*',
    '/system-admin/:path*',
    '/utilities/:path*',
    '/vaccination/:path*',
    '/settings/:path*',
  ],
};