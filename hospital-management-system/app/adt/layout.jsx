import React from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';

export default function AdtLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
