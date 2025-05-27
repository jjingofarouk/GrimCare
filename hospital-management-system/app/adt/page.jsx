import React from 'react';
import AdtForm from './AdtForm';
import AdtList from './AdtList';

export default function AdtPage() {
  const handleFormSubmit = () => {
    // Refresh list or handle submission
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admissions</h1>
      <AdtForm onSubmit={handleFormSubmit} />
      <AdtList />
    </div>
  );
}