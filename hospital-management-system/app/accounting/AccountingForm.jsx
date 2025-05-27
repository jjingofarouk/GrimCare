import { useState } from 'react';
import styles from './AccountingForm.module.css';
import { createTransaction } from './accountingService';

export default function AccountingForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    status: 'PENDING',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTransaction(formData);
      onSubmit();
      setFormData({ description: '', amount: '', category: '', status: 'PENDING' });
    } catch (error) {
      console.error('Error creating transaction:', error);
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
        </select>
      </div>
      <button type="submit" className={styles.submit}>Add Transaction</button>
    </form>
  );
}
