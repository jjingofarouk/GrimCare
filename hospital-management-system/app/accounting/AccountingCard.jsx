"use client";

import React from 'react';
import styles from './AccountingCard.module.css';

export default function AccountingCard({ item, type }) {
  const renderContent = () => {
    switch (type) {
      case 'transaction':
        return (
          <>
            <h3 className={styles.title}>{item.description}</h3>
            <span className={`${styles.status} ${item.status === 'PAID' ? styles.paid : styles.pending}`}>
              {item.status}
            </span>
            <p><strong>Amount:</strong> ${item.amount}</p>
            <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
            <p><strong>Category:</strong> {item.category}</p>
            {item.costCenter && <p><strong>Cost Center:</strong> {item.costCenter.name}</p>}
          </>
        );
      case 'payroll':
        return (
          <>
            <h3 className={styles.title}>{item.user.name} - {item.period}</h3>
            <span className={`${styles.status} ${item.status === 'PAID' ? styles.paid : styles.pending}`}>
              {item.status}
            </span>
            <p><strong>Salary:</strong> ${item.salary}</p>
            <p><strong>Taxes:</strong> ${item.taxes}</p>
            <p><strong>Benefits:</strong> ${item.benefits}</p>
          </>
        );
      case 'asset':
        return (
          <>
            <h3 className={styles.title}>{item.name}</h3>
            <span className={`${styles.status} ${item.status === 'ACTIVE' ? styles.paid : styles.pending}`}>
              {item.status}
            </span>
            <p><strong>Purchase Cost:</strong> ${item.purchaseCost}</p>
            <p><strong>Current Value:</strong> ${item.currentValue}</p>
            <p><strong>Purchase Date:</strong> {new Date(item.purchaseDate).toLocaleDateString()}</p>
          </>
        );
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {renderContent()}
      </div>
      <div className={styles.footer}>
        <button className={styles.button}>View Details</button>
      </div>
    </div>
  );
}