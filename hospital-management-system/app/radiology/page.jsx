// radiology/page.jsx
import React from 'react';
import RadiologyList from './RadiologyList';
import RadiologyForm from './RadiologyForm';

const RadiologyPage = () => {
  return (
    <div>
      <h1>Radiology Management</h1>
      <RadiologyForm />
      <RadiologyList />
    </div>
  );
};

export default RadiologyPage;
