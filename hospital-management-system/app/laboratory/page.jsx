// laboratory/page.jsx
import React from 'react';
import LaboratoryList from './LaboratoryList';
import LaboratoryForm from './LaboratoryForm';

const LaboratoryPage = () => {
  return (
    <div>
      <h1>Laboratory Management</h1>
      <LaboratoryForm />
      <LaboratoryList />
    </div>
  );
};

export default LaboratoryPage;
