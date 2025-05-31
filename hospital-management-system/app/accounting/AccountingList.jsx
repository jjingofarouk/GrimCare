"use client";

import React, { useState, useEffect } from 'react';
import AccountingCard from './AccountingCard';
import styles from './AccountingList.module.css';
import { getTransactions, getPayrolls, getAssets } from './accountingService';

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

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{type.charAt(0).toUpperCase() + type.slice(1)} History</h2>
      <div className={styles.grid}>
        {items.map((item) => (
          <AccountingCard key={item.id} item={item} type={type} />
        ))}
      </div>
    </div>
  );
}