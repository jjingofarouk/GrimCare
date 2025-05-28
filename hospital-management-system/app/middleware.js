import { NextResponse } from 'next/server';
import { getToken, hasPermission } from './auth';
import jwt from 'jsonwebtoken';

export async function middleware(request) {
  const token = getToken();
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/auth', '/api/auth'];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRole = decoded.role;

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
      '/queue-mngmt': 'Queue Management',
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

    if (featureName && !hasPermission(userRole, routeToFeatureMap[featureName])) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
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
    '/queue-mngmt/:path*',
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