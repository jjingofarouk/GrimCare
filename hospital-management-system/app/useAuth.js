'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getCurrentUser, getRoleRedirect } from './lib/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redirectPath, setRedirectPath] = useState(null);
  const authChecked = useRef(false); // Prevent multiple checks on mount

  // Function to get token from cookies
  const getTokenFromCookies = () => {
    if (typeof document === 'undefined') return null;
    return document.cookie.match(/(?:^|;\s*)token=([^;]*)/)?.[1] || null;
  };

  // Function to set authentication cookie
  const setAuthCookie = (token) => {
    if (typeof document !== 'undefined') {
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict; Secure`;
    }
  };

  // Function to clear authentication cookie
  const clearAuthCookie = () => {
    if (typeof document !== 'undefined') {
      document.cookie = `token=; path=/; max-age=0; SameSite=Strict`;
    }
  };

  // Function to check authentication
  const checkAuth = useCallback(async () => {
    console.log('Starting checkAuth');

    if (authChecked.current) return; // Prevent repeated calls
    authChecked.current = true; // Mark authentication as checked

    try {
      const token = getTokenFromCookies();
      console.log('Token retrieved:', token);

      if (token) {
        console.log('Calling getCurrentUser');
        const userData = await getCurrentUser(token);
        console.log('User data retrieved:', userData);
        setUser(userData);
        setRedirectPath(getRoleRedirect(userData?.role));
      } else {
        console.log('No token, redirecting to /auth');
        setRedirectPath('/auth');
      }
    } catch (err) {
      console.error('checkAuth error:', err.message);
      setError(err.message);
      setUser(null);
      setRedirectPath('/auth');
    } finally {
      setLoading(false);
    }
  }, []);

  // Run authentication check only once when component mounts
  useEffect(() => {
    console.log('Running checkAuth on mount');
    checkAuth();
  }, []); // No dependencies to prevent repeated execution

  // Function for login
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
        setRedirectPath(getRoleRedirect(data.user?.role));
        return { success: true, redirectPath };
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setError(error.message);
      setRedirectPath('/auth');
      throw error;
    }
  };

  // Function for logout
  const logout = () => {
    console.log('Logging out');
    clearAuthCookie();
    setUser(null);
    setError(null);
    setRedirectPath('/auth');
    return { success: true, redirectPath: '/auth' };
  };

  return { user, loading, error, redirectPath, login, logout };
};
