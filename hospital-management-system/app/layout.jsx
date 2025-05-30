'use client';

import React, { useState } from 'react';
import './globals.css';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from './useAuth';

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <body>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="layout-container">
            {user && (
              <>
                <Header toggleSidebar={toggleSidebar} />
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              </>
            )}
            <main className="main-content">{children}</main>
          </div>
        )}
      </body>
    </html>
  );
}