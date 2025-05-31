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
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1] || null;
  };

  const setAuthCookie = (token) => {
    if (typeof document !== 'undefined') {
      document.cookie = `token=${token}; Path=/; Max-Age=3600; SameSite=Strict; Secure`;
    }
  };

  const clearAuthCookie = () => {
    if (typeof document !== 'undefined') {
      document.cookie = `token=; Path=/; Max-Age=0; SameSite=Strict; Secure`;
    }
  };

  const checkAuth = useCallback(async () => {
    if (authChecked.current || typeof window === 'undefined') return;
    authChecked.current = true;

    const token = getTokenFromCookies();
    if (token) {
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'check', token }),
        });
        const data = await res.json();
        if (res.ok && data.user) {
          const userData = await getCurrentUser(data.user.uid);
          setUser(userData);
          const path = getRoleRedirect(userData?.role);
          setRedirectPath(path);
          if (window.location.pathname !== path) {
            router.push(path);
          }
        } else {
          setRedirectPath('/auth');
          router.push('/auth');
        }
      } catch {
        setRedirectPath('/auth');
        router.push('/auth');
      }
    } else {
      setRedirectPath('/auth');
      router.push('/auth');
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setAuthCookie(data.token);
      const userData = await getCurrentUser(data.user.uid);
      setUser(userData);
      const path = getRoleRedirect(userData?.role);
      setRedirectPath(path);
      router.push(path);
      return { success: true, redirectPath: path };
    } catch (error) {
      setError(error.message || 'Login failed');
      setRedirectPath('/auth');
      throw error;
    }
  };

  const register = async (email, password, name, role = 'USER') => {
    try {
      setError(null);
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', email, password, name, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setAuthCookie(data.token);
      const userData = await getCurrentUser(data.user.uid);
      setUser(userData);
      const path = getRoleRedirect(userData?.role);
      setRedirectPath(path);
      router.push(path);
      return { success: true, redirectPath: path };
    } catch (error) {
      setError(error.message || 'Registration failed');
      setRedirectPath('/auth');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      clearAuthCookie();
      setUser(null);
      setError(null);
      setRedirectPath('/auth');
      router.push('/auth');
      return { success: true, redirectPath: '/auth' };
    } catch (error) {
      setError(error.message || 'Logout failed');
      throw error;
    }
  };

  return { user, loading, error, redirectPath, login, logout, register };
};