"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isAuthenticated } from './authUtils'; // Adjust path as needed


export default function AuthLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Or use cookies if needed
    if (!isAuthenticated(token)) {
      router.push('/auth');
    }
  }, [router]);

  return (
    <div style={{ marginTop: '64px', padding: '1rem' }}>
      <Header />
      <main>{children}</main>
    </div>
  );
}