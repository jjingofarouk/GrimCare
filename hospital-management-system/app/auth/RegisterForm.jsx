"use client" ;

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './RegisterForm.module.css';
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
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label>Role</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Doctor</option>
          <option value="NURSE">Nurse</option>
          <option value="STAFF">Staff</option>
        </select>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button}>Register</button>
    </form>
  );
}
