'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { getCurrentUser, getRoleRedirect } from './lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redirectPath, setRedirectPath] = useState(null);
  const authChecked = useRef(false);
  const router = useRouter();

  const getTokenFromCookies = () => {
    if (typeof document === 'undefined') return null;
    console.log('Raw document.cookie:', document.cookie);
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null;
    console.log('Parsed token:', token ? '[present]' : 'none');
    return token;
  };

  const setAuthCookie = (token) => {
    if (typeof document !== 'undefined') {
      console.log('Setting cookie with token:', token || 'undefined');
      document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Strict; Secure`;
      console.log('Cookie set, document.cookie:', document.cookie);
    }
  };

  const clearAuthCookie = () => {
    if (typeof document !== 'undefined') {
      document.cookie = `token=; path=/; max-age=0; SameSite=Strict`;
      console.log('Auth cookie cleared');
    }
  };

  const checkAuth = useCallback(async () => {
    if (authChecked.current) return;
    authChecked.current = true;

    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          console.log('Firebase token:', token ? '[present]' : 'none');
          setAuthCookie(token);
          const userData = await getCurrentUser(firebaseUser.uid);
          setUser(userData);
          const path = getRoleRedirect(userData?.role);
          setRedirectPath(path);
          if (path !== window.location.pathname) router.push(path);
        } else {
          console.log('No Firebase user, redirecting to /auth');
          setRedirectPath('/auth');
          router.push('/auth');
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error('checkAuth error:', err.message);
      setError(err.message || 'Authentication failed');
      setUser(null);
      setRedirectPath('/auth');
      router.push('/auth');
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    console.log('Starting login for:', email);
    try {
      setError(null);
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      const token = await firebaseUser.getIdToken();
      console.log('Login token:', token);
      setAuthCookie(token);
      const userData = await getCurrentUser(firebaseUser.uid);
      setUser(userData);
      const path = getRoleRedirect(userData?.role);
      setRedirectPath(path);
      router.push(path);
      return { success: true, redirectPath: path };
    } catch (error) {
      console.error('Login error:', error.message);
      setError(error.message || 'Login failed');
      setRedirectPath('/auth');
      throw error;
    }
  };

  const register = async (email, password, name, role) => {
    console.log('Starting register for:', email);
    try {
      setError(null);
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      const token = await firebaseUser.getIdToken();
      console.log('Register token:', token);
      const userData = await prisma.user.create({
        data: {
          id: parseInt(firebaseUser.uid),
          email,
          name,
          role: role || 'USER',
        },
      });
      if (role === 'DOCTOR') {
        await prisma.doctor.create({
          data: {
            userId: parseInt(firebaseUser.uid),
            specialty: 'General',
            department: 'General',
            hospital: 'Default Hospital',
            designation: 'Doctor',
            availabilityStatus: 'AVAILABLE',
          },
        });
      }
      if (role === 'USER') {
        await prisma.patient.create({
          data: {
            userId: parseInt(firebaseUser.uid),
            type: 'Outpatient',
            recordId: `P${firebaseUser.uid}${Date.now()}`,
          },
        });
      }
      setAuthCookie(token);
      setUser(userData);
      const path = getRoleRedirect(userData?.role);
      setRedirectPath(path);
      router.push(path);
      return { success: true, redirectPath: path };
    } catch (error) {
      console.error('Register error:', error.message);
      setError(error.message || 'Registration failed');
      setRedirectPath('/auth');
      throw error;
    }
  };

  const logout = async () => {
    console.log('Logging out');
    await signOut(auth);
    clearAuthCookie();
    setUser(null);
    setError(null);
    setRedirectPath('/auth');
    router.push('/auth');
    return { success: true, redirectPath: '/auth' };
  };

  return { user, loading, error, redirectPath, login, logout, register };
};