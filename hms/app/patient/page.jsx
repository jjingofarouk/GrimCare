// patient/page.jsx
import React from 'react';
import PatientList from './PatientList';
import PatientForm from './PatientForm';

const PatientPage = () => {
  return (
    <div>
      <h1>Patient Management</h1>
      <PatientForm />
      <PatientList />
    </div>
  );
};

export default PatientPage;
