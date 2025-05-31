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
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null;
    return token;
  };

  const setAuthCookie = (token) => {
    if (typeof document !== 'undefined') {
      document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Strict; Secure`;
    }
  };

  const clearAuthCookie = () => {
    if (typeof document !== 'undefined') {
      document.cookie = `token=; path=/; max-age=0; SameSite=Strict`;
    }
  };

  const checkAuth = useCallback(async () => {
    if (authChecked.current) return;
    authChecked.current = true;

    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          setAuthCookie(token);
          try {
            const userData = await getCurrentUser(firebaseUser.uid);
            setUser(userData);
            const path = getRoleRedirect(userData?.role);
            setRedirectPath(path);
            if (path !== window.location.pathname) router.push(path);
          } catch (err) {
            setError('User data not found. Please register.');
            setRedirectPath('/auth');
            router.push('/auth');
          }
        } else {
          setRedirectPath('/auth');
          router.push('/auth');
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
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
    try {
      setError(null);
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      const token = await firebaseUser.getIdToken();
      setAuthCookie(token);
      const userData = await getCurrentUser(firebaseUser.uid);
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

  const register = async (email, password, name, role) => {
    try {
      setError(null);
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      const token = await firebaseUser.getIdToken();
      const userId = await prisma.user.count() + 1; // Generate sequential ID
      const userData = await prisma.user.create({
        data: {
          id: userId,
          email,
          name,
          role: role || 'USER',
        },
      });
      if (role === 'DOCTOR') {
        await prisma.doctor.create({
          data: {
            userId: userId,
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
            userId: userId,
            type: 'Outpatient',
            recordId: `P${userId}${Date.now()}`,
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
      setError(error.message || 'Registration failed');
      setRedirectPath('/auth');
      throw error;
    }
  };

  const logout = async () => {
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