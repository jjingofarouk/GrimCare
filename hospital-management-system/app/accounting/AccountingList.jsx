"use client";

import { useState, useEffect } from 'react';
import AccountingCard from './AccountingCard';
import styles from './AccountingList.module.css';
import { getTransactions } from './accountingService';

export default function AccountingList() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Transaction History</h2>
      <div className={styles.grid}>
        {transactions.map((transaction) => (
          <AccountingCard key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}
