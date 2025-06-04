// pharmacy/PharmacyBilling.jsx
// Billing and refund management

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, TextField, Button } from '@mui/material';
import { createInvoice, processRefund, getPrescriptions } from './pharmacyService';
import styles from './PharmacyBilling.module.css';

const PharmacyBilling = () => {
  const [invoices, setInvoices] = useState([]);
  const [refundData, setRefundData] = useState({ invoiceId: '', reason: '', amount: 0, processedById: '' });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const prescriptions = await getPrescriptions();
    setInvoices(prescriptions.filter(p => p.invoice));
  };

  const handleCreateInvoice = async (prescriptionId, totalAmount) => {
    const invoice = await createInvoice({ prescriptionId, totalAmount });
    setInvoices([...invoices, invoice]);
  };

  const handleProcessRefund = async () => {
    await processRefund(refundData);
    setRefundData({ invoiceId: '', reason: '', amount: 0, processedById: '' });
    fetchInvoices();
  };

  const columns = [
    { field: 'id', headerName: 'Invoice ID', width: 100 },
    { field: 'prescriptionId', headerName: 'Prescription ID', width: 150 },
    { field: 'totalAmount', headerName: 'Total Amount', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'paymentMethod', headerName: 'Payment Method', width: 150 },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Billing & Invoicing</Typography>
      <Box className={styles.refundForm}>
        <TextField
          label="Invoice ID"
          name="invoiceId"
          value={refundData.invoiceId}
          onChange={(e) => setRefundData({ ...refundData, invoiceId: e.target.value })}
        />
        <TextField
          label="Reason"
          name="reason"
          value={refundData.reason}
          onChange={(e) => setRefundData({ ...refundData, reason: e.target.value })}
        />
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={refundData.amount}
          onChange={(e) => setRefundData({ ...refundData, amount: e.target.value })}
        />
        <TextField
          label="Processed By ID"
          name="processedById"
          value={refundData.processedById}
          onChange={(e) => setRefundData({ ...refundData, processedById: e.target.value })}
        />
        <Button variant="contained" onClick={handleProcessRefund}>
          Process Refund
        </Button>
      </Box>
      <DataGrid
        rows={invoices}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        className={styles.grid}
        autoHeight
      />
    </Box>
  );
};

export default PharmacyBilling;