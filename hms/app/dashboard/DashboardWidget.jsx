'use client';
import React from 'react';
import styles from './DashboardWidget.module.css';

export default function DashboardWidget({ title, value }) {
  return (
    <div className={styles.widget}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.value}>{value}</p>
    </div>
  );
}
