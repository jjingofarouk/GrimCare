'use client';
import React, { useState, useEffect } from 'react';
import styles from './DashboardOverview.module.css';
import DashboardWidget from './DashboardWidget';
import DashboardChart from './DashboardChart';
import { getDashboardData } from './dashboardService';

export default function DashboardOverview() {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError('Failed to fetch dashboard data');
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dashboard Overview</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.widgets}>
        <DashboardWidget
          title="Total Appointments"
          value={data.appointments || 0}
        />
        <DashboardWidget title="Pending Bills" value={data.bills || 0} />
        <DashboardWidget title="Active Claims" value={data.claims || 0} />
      </div>
      <DashboardChart data={data.chartData || []} />
    </div>
  );
}
