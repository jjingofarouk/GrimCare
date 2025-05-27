// pharmacy/page.jsx
import React from 'react';
import PharmacyList from './PharmacyList';
import PharmacyForm from './PharmacyForm';

const PharmacyPage = () => {
  return (
    <div>
      <h1>Pharmacy Management</h1>
      <PharmacyForm />
      <PharmacyList />
    </div>
  );
};

export default PharmacyPage;
