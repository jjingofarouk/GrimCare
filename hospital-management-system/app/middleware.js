import { NextResponse } from 'next/server';
import { hasPermission } from './lib/auth';
import jwt from 'jsonwebtoken';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const token =
    request.headers.get('authorization')?.replace('Bearer ', '') ||
    request.cookies.get('token')?.value;

  console.log(
    `Middleware: Path=${pathname}, Token=${
      token ? '[present]' : 'none'
    }, JWT_SECRET=${process.env.JWT_SECRET ? '[present]' : 'missing'}`
  );

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET environment variable is missing');
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  const publicRoutes = ['/auth', '/api/auth', '/', '/access-denied'];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!token) {
    console.warn(`No token found, redirecting to /auth for path: ${pathname}`);
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.warn('Token expired, redirecting to /auth');
      return NextResponse.redirect(new URL('/auth', request.url));
    }

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
      '/queue-mgmt': 'Queue Management',
      '/radiology': 'Radiology',
      '/reports': 'Reports',
      '/social-service': 'Social Service',
      '/substore': 'Substore',
      '/system-admin': 'System Admin',
      '/utilities': 'Utilities',
      '/vaccination': 'Vaccination',
      '/settings': 'Settings',
      '/clinical-settings': 'Clinical Settings',
    };

    const featureName = Object.keys(routeToFeatureMap).find((route) =>
      pathname.startsWith(route)
    );
    if (
      featureName &&
      !hasPermission(userRole, routeToFeatureMap[featureName])
    ) {
      console.warn(
        `User role ${userRole} lacks permission for ${featureName}, redirecting to /access-denied`
      );
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }

    // Check for Doctor record for DOCTOR role
    if (userRole === 'DOCTOR' && featureName && routeToFeatureMap[featureName] === 'Clinical') {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { doctor: true },
      });
      if (!user?.doctor) {
        console.warn(`No Doctor record for user ${decoded.userId}, redirecting to /doctor/setup`);
        return NextResponse.redirect(new URL('/doctor/setup', request.url));
      }
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
    '/queue-mgmt/:path*',
    '/radiology/:path*',
    '/reports/:path*',
    '/social-service/:path*',
    '/substore/:path*',
    '/system-admin/:path*',
    '/utilities/:path*',
    '/vaccination/:path*',
    '/settings/:path*',
    '/clinical-settings/:path*',
  ],
};