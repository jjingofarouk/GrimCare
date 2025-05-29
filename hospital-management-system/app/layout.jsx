// app/layout.jsx
'use client';

import React, { useState } from 'react';
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/auth');
    return null;
  }

  return (
    <html lang="en">
      <body className={styles.body}>
        <Header toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={styles.main}>
          {children}
        </main>
      </body>
    </html>
  );
}