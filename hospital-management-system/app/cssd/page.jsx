'use client';
import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import CssdInstrumentList from './CssdInstrumentList';
import CssdRecordList from './CssdRecordList';
import CssdRequisitionList from './CssdRequisitionList';
import CssdLogList from './CssdLogList';

export default function CssdPage() {
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Tabs value={tab} onChange={handleTabChange} centered sx={{ mb: 4 }}>
        <Tab label="Instruments" />
        <Tab label="Sterilization Records" />
        <Tab label="Requisitions" />
        <Tab label="Audit Logs" />
      </Tabs>
      {tab === 0 && <CssdInstrumentList />}
      {tab === 1 && <CssdRecordList />}
      {tab === 2 && <CssdRequisitionList />}
      {tab === 3 && <CssdLogList />}
    </Box>
  );
}