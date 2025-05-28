// emergency/layout.jsx
import React from 'react';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';

const EmergencyLayout = ({ children }) => {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default EmergencyLayout;
