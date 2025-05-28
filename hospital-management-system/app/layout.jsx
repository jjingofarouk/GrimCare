import React from 'react';
import './globals.css';
import Header from './Header';
import Sidebar from './Sidebar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-black flex">
        {/* Sidebar stays on the left */}
        <Sidebar />

        <div className="flex flex-col flex-1">
          {/* Header stays on top */}
          <Header />

          {/* Main content goes here */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}