'use client';
import React from 'react';
import DoctorList from './DoctorList';
import DoctorForm from './DoctorForm';

export default function DoctorPage() {
  const handleSuccess = () => {
    console.log('Doctor created');
  };

  return (
    <div>
      <DoctorForm onSuccess={handleSuccess} />
      <DoctorList />
    </div>
  );
}
