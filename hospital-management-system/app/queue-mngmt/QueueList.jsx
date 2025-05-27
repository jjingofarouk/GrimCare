// queue-mngmt/QueueList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './QueueList.module.css';
import { getQueues } from './queueService';
import QueueCard from './QueueCard';

const QueueList = () => {
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const data = await getQueues();
        setQueues(data);
      } catch (error) {
        console.error('Error fetching queues:', error);
      }
    };
    fetchQueues();
  }, []);

  return (
    <div className={styles.list}>
      {queues.map((queue) => (
        <QueueCard key={queue.id} queue={queue} />
      ))}
    </div>
  );
};

export default QueueList;
