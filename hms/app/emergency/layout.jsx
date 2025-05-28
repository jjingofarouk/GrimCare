// emergency/layout.jsx
import React from 'react';
import Sidebar from '../Sidebar';

const EmergencyLayout = ({ children }) => {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default EmergencyLayout;
