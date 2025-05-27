// useAuth.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, signIn, signOut } from 'next-auth/react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    fetchSession();
  }, []);

  const login = async (credentials) => {
    try {
      await signIn('credentials', { ...credentials, redirect: false });
      const session = await getSession();
      setUser(session?.user || null);
      router.push('/app');
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    setUser(null);
    router.push('/auth/login');
  };

  return { user, loading, login, logout };
};

export default useAuth;
