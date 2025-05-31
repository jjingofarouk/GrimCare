"use client";

import React from 'react';
import { Card, CardContent, CardActions, Typography, Chip, Button } from '@mui/material';
import styles from './AccountingCard.module.css';

export default function AccountingCard({ item, type }) {
  const renderContent = () => {
    switch (type) {
      case 'transaction':
        return (
          <>
            <Typography variant="h6" className={styles.title}>
              {item.description}
            </Typography>
            <Chip
              label={item.status}
              className={`${styles.status} ${
                item.status === 'PAID' ? styles.paid : item.status === 'OVERDUE' ? styles.overdue : styles.pending
              }`}
            />
            <Typography variant="body2">
              <strong>Amount:</strong> ${item.amount}
            </Typography>
            <Typography variant="body2">
              <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2">
              <strong>Category:</strong> {item.category}
            </Typography>
            {item.costCenter && (
              <Typography variant="body2">
                <strong>Cost Center:</strong> {item.costCenter.name}
              </Typography>
            )}
          </>
        );
      case 'payroll':
        return (
          <>
            <Typography variant="h6" className={styles.title}>
              {item.user.name} - {item.period}
            </Typography>
            <Chip
              label={item.status}
              className={`${styles.status} ${
                item.status === 'PAID' ? styles.paid : item.status === 'OVERDUE' ? styles.overdue : styles.pending
              }`}
            />
            <Typography variant="body2">
              <strong>Salary:</strong> ${item.salary}
            </Typography>
            <Typography variant="body2">
              <strong>Taxes:</strong> ${item.taxes}
            </Typography>
            <Typography variant="body2">
              <strong>Benefits:</strong> ${item.benefits}
            </Typography>
          </>
        );
      case 'asset':
        return (
          <>
            <Typography variant="h6" className={styles.title}>
              {item.name}
            </Typography>
            <Chip
              label={item.status}
              className={`${styles.status} ${
                item.status === 'ACTIVE' ? styles.paid : item.status === 'OVERDUE' ? styles.overdue : styles.pending
              }`}
            />
            <Typography variant="body2">
              <strong>Purchase Cost:</strong> ${item.purchaseCost}
            </Typography>
            <Typography variant="body2">
              <strong>Current Value:</strong> ${item.currentValue}
            </Typography>
            <Typography variant="body2">
              <strong>Purchase Date:</strong> {new Date(item.purchaseDate).toLocaleDateString()}
            </Typography>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={styles.card}>
      <CardContent className={styles.header}>{renderContent()}</CardContent>
      <CardActions className={styles.footer}>
        <Button variant="contained" className={styles.button}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}