// radiology/RadiologyList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './RadiologyList.module.css';
import { getRadiologyScans } from './radiologyService';
import RadiologyCard from './RadiologyCard';

const RadiologyList = () => {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const data = await getRadiologyScans();
        setScans(data);
      } catch (error) {
        console.error('Error fetching radiology scans:', error);
      }
    };
    fetchScans();
  }, []);

  return (
    <div className={styles.list}>
      {scans.map((scan) => (
        <RadiologyCard key={scan.id} scan={scan} />
      ))}
    </div>
  );
};

export default RadiologyList;
