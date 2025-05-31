"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Add this import
import styles from './LoginForm.module.css';
import { login } from './authService';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      router.push('/appointment');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>Login</h2>
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
        {error && <p className={styles.formError}>{error}</p>}
        <button type="submit" className={styles.formButton}>Login</button>
        <p className={styles.registerLink}>
          Don’t have an account? <Link href="/auth/register">Register</Link>
        </p>
      </form>
    </div>
  );
}