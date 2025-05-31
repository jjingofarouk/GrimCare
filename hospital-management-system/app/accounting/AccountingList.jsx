"use client";

import React, { useState, useEffect } from 'react';
import { getTransactions, getPayrolls, getAssets } from './accountingService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';

export default function AccountingList({ type }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        let data;
        if (type === 'transaction') data = await getTransactions();
        if (type === 'payroll') data = await getPayrolls();
        if (type === 'asset') data = await getAssets();
        setItems(data);
      } catch (error) {
        console.error(`Error fetching ${type}s:`, error);
      }
    }
    fetchData();
  }, [type]);

  // Define table headers based on type
  const headers = {
    transaction: ['ID', 'Date', 'Description', 'Amount'],
    payroll: ['ID', 'Date', 'Employee', 'Amount'],
    asset: ['ID', 'Name', 'Purchase Date', 'Value'],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {type.charAt(0).toUpperCase() + type.slice(1)} History
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label={`${type} table`}>
          <TableHead>
            <TableRow>
              {headers[type].map((header, index) => (
                <TableCell
                  key={index}
                  sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                sx={{ '&:hover': { backgroundColor: 'grey.50' } }}
              >
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.date || item.purchaseDate}</TableCell>
                <TableCell>
                  {item.description || item.employee || item.name}
                </TableCell>
                <TableCell>{item.amount || item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}