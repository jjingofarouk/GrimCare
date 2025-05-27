'use client';
import React from 'react';
import CssdList from './CssdList';
import CssdForm from './CssdForm';

export default function CssdPage() {
  const handleSuccess = () => {
    console.log('CSSD record created');
  };

  return (
    <div>
      <CssdForm onSuccess={handleSuccess} />
      <CssdList />
    </div>
  );
}
