import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import Header from './Header';
import Sidebar from './Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Hospital Management System',
  description: 'A comprehensive hospital management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <div className="layout-container">
          <Sidebar />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}