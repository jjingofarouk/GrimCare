// fixed-assets/page.jsx
import React from 'react';
import FixedAssetsList from './FixedAssetsList';
import FixedAssetsForm from './FixedAssetsForm';

const FixedAssetsPage = () => {
  return (
    <div>
      <h1>Fixed Assets Management</h1>
      <FixedAssetsForm />
      <FixedAssetsList />
    </div>
  );
};

export default FixedAssetsPage;
