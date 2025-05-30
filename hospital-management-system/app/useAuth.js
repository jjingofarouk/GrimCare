'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getRoleRedirect } from './lib/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redirectPath, setRedirectPath] = useState(null);
  const authChecked = useRef(false);
  const router = useRouter();

  const getTokenFromCookies = () => {
    if (typeof document === 'undefined') return null;
    const token = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)?.[1] || null;
    console.log('Token retrieved:', token ? '[present]' : 'none');
    return token;
  };

  const setAuthCookie = (token) => {
    if (typeof document !== 'undefined') {
      document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
      console.log('Auth cookie set:', token ? '[present]' : 'none');
    }
  };

  const clearAuthCookie = () => {
    if (typeof document !== 'undefined') {
      document.cookie = `token=; path=/; max-age=0; SameSite=Strict`;
      console.log('Auth cookie cleared');
    }
  };

  const checkAuth = useCallback(async () => {
    console.log('Starting checkAuth');
    if (authChecked.current) {
      console.log('Auth already checked, skipping');
      return;
    }
    authChecked.current = true;

    try {
      const token = getTokenFromCookies();
      if (token) {
        console.log('Calling getCurrentUser');
        const userData = await getCurrentUser(token);
        console.log('User data retrieved:', userData);
        setUser(userData);
        const path = getRoleRedirect(userData?.role);
        setRedirectPath(path);
        if (path !== window.location.pathname) {
          console.log('Redirecting to:', path);
          router.push(path);
        }
      } else {
        console.log('No token, redirecting to /auth');
        setRedirectPath('/auth');
        router.push('/auth');
      }
    } catch (err) {
      console.error('checkAuth error:', err.message);
      setError(err.message || 'Authentication failed');
      setUser(null);
      setRedirectPath('/auth');
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    console.log('Running checkAuth on mount');
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    console.log('Starting login for:', email);
    try {
      setError(null);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', email, password }),
        }
      );

      console.log('Login response status:', response.status);
      const data = await response.json();

      if (response.ok) {
        setAuthCookie(data.token);
        setUser(data.user || {});
        const path = getRoleRedirect(data.user?.role);
        setRedirectPath(path);
        router.push(path);
        return { success: true, redirectPath: path };
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setError(error.message || 'An unexpected error occurred. Please try again.');
      setRedirectPath('/auth');
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out');
    clearAuthCookie();
    setUser(null);
    setError(null);
    setRedirectPath('/auth');
    router.push('/auth');
    return { success: true, redirectPath: '/auth' };
  };

  const register = async (email, password, name, role) => {
    console.log('Starting register for:', email);
    try {
      setError(null);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'register', email, password, name, role }),
        }
      );

      console.log('Register response status:', response.status);
      const data = await response.json();

      if (response.ok) {
        setAuthCookie(data.token);
        setUser(data.user || {});
        const path = getRoleRedirect(data.user?.role);
        setRedirectPath(path);
        router.push(path);
        return { success: true, redirectPath: path };
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Register error:', error.message);
      setError(error.message || 'An unexpected error occurred. Please try again.');
      setRedirectPath('/auth');
      throw error;
    }
  };

  return { user, loading, error, redirectPath, login, logout, register };
};