"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './LoginForm.module.css';
import { register } from './authService';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'PATIENT',
  });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      router.push('/auth/login');
    } catch (err) {
      setError('Failed to register');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>Register</h2>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.formInput}
            required
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.formInput}
            required
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.formInput}
            required
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={styles.formInput}
          >
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
            <option value="NURSE">Nurse</option>
            <option value="LAB_TECHNICIAN">Lab Technician</option>
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        {error && <p className={styles.formError}>{error}</p>}
        <button type="submit" className={styles.formButton}>Register</button>
        <p className={styles.registerLink}>
          Already have an account? <Link href="/auth/login">Login</Link>
        </p>
      </form>
    </div>
  );
}