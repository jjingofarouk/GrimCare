"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isAuthenticated } from './authUtils';



export default function AuthLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!isAuthenticated(token)) {
      router.push('/auth');
    }
  }, [router]);

  return (
    <div style={{ marginTop: '64px', padding: '1rem' }}>
      <main>{children}</main>
    </div>
  );
}