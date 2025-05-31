'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from './auth/authUtils';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const { user } = await import('./authService').then((m) => m.login(credentials));
      setUser(user);
      router.push('/appointment');
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    await import('./authService').then((m) => m.logout());
    setUser(null);
    router.push('/auth/login');
  };

  return { user, loading, login, logout };
};

export default useAuth;