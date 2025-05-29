"use client";

import React from 'react';

import '../globals.css';

export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}