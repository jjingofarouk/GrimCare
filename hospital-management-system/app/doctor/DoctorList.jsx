'use client';
import React, { useState, useEffect } from 'react';
import styles from './DoctorList.module.css';
import DoctorCard from './DoctorCard';
import { getDoctors } from './doctorService';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (err) {
        setError('Failed to fetch doctors');
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Doctors</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}
