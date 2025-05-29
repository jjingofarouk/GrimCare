// app/layout.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';
import styles from './layout.module.css';

export default function RootLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <html lang="en">
      <body className={styles.body}>
        {user && (
          <>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          </>
        )}
        <main className={styles.main}>
          {children}
        </main>
      </body>
    </html>
  );
}