// vaccination/page.jsx
import React from 'react';
import VaccinationList from './VaccinationList';
import VaccinationForm from './VaccinationForm';

const VaccinationPage = () => {
  return (
    <div>
      <h1>Vaccination Management</h1>
      <VaccinationForm />
      <VaccinationList />
    </div>
  );
};

export default VaccinationPage;
