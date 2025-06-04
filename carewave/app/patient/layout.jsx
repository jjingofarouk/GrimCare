// patient/layout.jsx


// patient/PatientLayout.jsx
import React from 'react';

const PatientLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-bold">Patient Management</h1>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
};

export default PatientLayout;



