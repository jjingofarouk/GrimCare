"use client";

import React, { useState } from 'react';
import AccountingForm from './AccountingForm';
import AccountingList from './AccountingList';

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState('transaction');

  const handleFormSubmit = () => {
    // Trigger list refresh
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Accounting</h1>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab('transaction')} className={activeTab === 'transaction' ? 'font-bold' : ''}>Transactions</button>
        <button onClick={() => setActiveTab('payroll')} className={activeTab === 'payroll' ? 'font-bold' : ''}>Payroll</button>
        <button onClick={() => setActiveTab('asset')} className={activeTab === 'asset' ? 'font-bold' : ''}>Assets</button>
      </div>
      <AccountingForm onSubmit={handleFormSubmit} type={activeTab} />
      <AccountingList type={activeTab} />
    </div>
  );
}