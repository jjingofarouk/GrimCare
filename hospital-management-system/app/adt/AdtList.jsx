import { useState, useEffect } from 'react';
import AdtCard from './AdtCard';
import styles from './AdtList.module.css';
import { getAdmissions } from './adtService';

export default function AdtList() {
  const [admissions, setAdmissions] = useState([]);

  useEffect(() => {
    async function fetchAdmissions() {
      try {
        const data = await getAdmissions();
        setAdmissions(data);
      } catch (error) {
        console.error('Error fetching admissions:', error);
      }
    }
    fetchAdmissions();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Admissions</h2>
      <div className={styles.grid}>
        {admissions.map((admission) => (
          <AdtCard key={admission.id} admission={admission} />
        ))}
      </div>
    </div>
  );
}