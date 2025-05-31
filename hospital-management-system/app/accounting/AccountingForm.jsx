"use client";

import React, { useState } from 'react';
import { createTransaction } from './accountingService';
import styles from './AccountingForm.module.css';

export default function AccountingForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    status: 'PENDING',
    type: 'GENERAL_LEDGER',
    date: '',
    costCenterId: '',
    patientId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category || !formData.status || !formData.type) {
      alert('Please fill all required fields');
      return;
    }
    try {
      const transactionData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        status: formData.status,
        type: formData.type,
        date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
        costCenterId: formData.costCenterId ? parseInt(formData.costCenterId) : null,
        patientId: formData.patientId ? parseInt(formData.patientId) : null,
      };
      await createTransaction(transactionData);
      onSubmit();
      setFormData({
        description: '',
        amount: '',
        category: '',
        status: 'PENDING',
        type: 'GENERAL_LEDGER',
        date: '',
        costCenterId: '',
        patientId: '',
      });
      alert('Transaction created successfully!');
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert(`Failed to create transaction: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="amount" className={styles.label}>Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className={styles.input}
          step="0.01"
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="category" className={styles.label}>Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">Select Category</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
          <option value="RECEIVABLE">Receivable</option>
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="status" className={styles.label}>Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="type" className={styles.label}>Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="GENERAL_LEDGER">General Ledger</option>
          <option value="RECEIVABLE">Receivable</option>
          <option value="EXPENSE">Expense</option>
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="date" className={styles.label}>Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={styles.input}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="costCenterId" className={styles.label}>Cost Center ID (Optional)</label>
        <input
          type="number"
          id="costCenterId"
          name="costCenterId"
          value={formData.costCenterId}
          onChange={handleChange}
          className={styles.input}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="patientId" className={styles.label}>Patient ID (Optional)</label>
        <input
          type="number"
          id="patientId"
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          className={styles.input}
        />
      </div>
      <button type="submit" className={styles.submit}>Add Transaction</button>
    </form>
  );
}