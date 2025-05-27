// reports/layout.jsx
import React from 'react';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';

const ReportsLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};

export default ReportsLayout;
