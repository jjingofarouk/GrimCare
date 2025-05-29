'use client';

import React, { useState } from 'react';
import './globals.css';
import Header from './Header';
import Sidebar from './Sidebar';

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <body>
        <Header toggleSidebar={toggleSidebar} />
        <div className="layout-container">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
