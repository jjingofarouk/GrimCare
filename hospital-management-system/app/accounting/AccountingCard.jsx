"use client";

import React from 'react';
import styles from './AccountingCard.module.css';

export default function AccountingCard({ transaction }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{transaction.description}</h3>
        <span className={`${styles.status} ${transaction.status === 'PAID' ? styles.paid : styles.pending}`}>
          {transaction.status}
        </span>
      </div>
      <div className={styles.body}>
        <p><strong>Amount:</strong> ${transaction.amount}</p>
        <p><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
        <p><strong>Category:</strong> {transaction.category}</p>
      </div>
      <div className={styles.footer}>
        <button className={styles.button}>View Details</button>
      </div>
    </div>
  );
}
