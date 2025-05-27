// queue-mngmt/QueueCard.jsx
'use client';
import React from 'react';
import styles from './QueueCard.module.css';

const QueueCard = ({ queue }) => {
  return (
    <div className={styles.card}>
      <h3>{queue.patientName}</h3>
      <p>Queue ID: {queue.queueId}</p>
      <p>Department: {queue.department}</p>
      <p>Status: {queue.status}</p>
      <p>Queue Time: {new Date(queue.queueTime).toLocaleString()}</p>
    </div>
  );
};

export default QueueCard;
