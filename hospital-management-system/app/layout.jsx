import React from 'react';
import Header from './Header';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div style={{ marginTop: '64px' }}>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}