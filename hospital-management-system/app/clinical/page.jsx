'use client';
import React from 'react';
import ClinicalList from './ClinicalList';
import ClinicalForm from './ClinicalForm';

// Mock data for demo (replace with API calls in production)
const patients = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
];

export default function ClinicalPage() {
  const handleSuccess = () => {
    console.log('Clinical record created');
  };

  return (
    <div>
      <ClinicalForm patients={patients} onSuccess={handleSuccess} />
      <ClinicalList />
    </div>
  );
}
