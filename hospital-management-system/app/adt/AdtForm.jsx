import { useState } from 'react';
import styles from './AdtForm.module.css';
import { createAdmission } from './adtService';

export default function AdtForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    patientName: '',
    ward: '',
    admissionDate: '',
    doctor: '',
    status: 'ADMITTED',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAdmission(formData);
      onSubmit();
      setFormData({ patientName: '', ward: '', admissionDate: '', doctor: '', status: 'ADMITTED' });
    } catch (error) {
      console.error('Error creating admission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="patientName" className={styles.label}>Patient Name</label>
        <input
          type="text"
          id="patientName"
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="ward" className={styles.label}>Ward</label>
        <input
          type="text"
          id="ward"
          name="ward"
          value={formData.ward}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="admissionDate" className={styles.label}>Admission Date</label>
        <input
          type="date"
          id="admissionDate"
          name="admissionDate"
          value={formData.admissionDate}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="doctor" className={styles.label}>Doctor</label>
        <input
          type="text"
          id="doctor"
          name="doctor"
          value={formData.doctor}
          onChange={handleChange}
          className={styles.input}
          required
        />
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
          <option value="ADMITTED">Admitted</option>
          <option value="DISCHARGED">Discharged</option>
        </select>
      </div>
      <button type="submit" className={styles.submit}>Add Admission</button>
    </form>
  );
}