
"use client";

import { useRouter } from 'next/navigation';
import jwtDecode from 'jwt-decode';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const requireAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();

    if (!isAuthenticated()) {
      router.push('/auth');
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `RequireAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return AuthenticatedComponent;
};