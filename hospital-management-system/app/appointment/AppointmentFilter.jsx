
// AppointmentFilter.jsx
import React, { useState, useEffect } from 'react';
import styles from './AppointmentFilter.module.css';

export default function AppointmentFilter({ onFilter, patients = [], doctors = [] }) {
  const [filters, setFilters] = useState({
    status: 'ALL',
    dateFrom: '',
    dateTo: '',
    doctorId: '',
    patientId: '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form className={styles.filterForm} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={filters.status} onChange={handleChange}>
          <option value="ALL">All</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="dateFrom">From Date</label>
        <input
          id="dateFrom"
          type="date"
          name="dateFrom"
          value={filters.dateFrom}
          onChange={handleChange}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="dateTo">To Date</label>
        <input
          id="dateTo"
          type="date"
          name="dateTo"
          value={filters.dateTo}
          onChange={handleChange}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="doctorId">Doctor</label>
        <select id="doctorId" name="doctorId" value={filters.doctorId} onChange={handleChange}>
          <option value="">All Doctors</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="patientId">Patient</label>
        <select id="patientId" name="patientId" value={filters.patientId} onChange={handleChange}>
          <option value="">All Patients</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className={styles.button}>Apply Filters</button>
    </form>
  );
}
