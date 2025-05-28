"use client";

import React from 'react';
import AccountingForm from './AccountingForm';
import AccountingList from './AccountingList';

export default function AccountingPage() {
  const handleFormSubmit = () => {
    // Refresh list or handle submission
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Accounting</h1>
      <AccountingForm onSubmit={handleFormSubmit} />
      <AccountingList />
    </div>
  );
}
