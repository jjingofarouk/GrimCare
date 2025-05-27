// laboratory/LaboratoryForm.jsx
import React, { useState } from 'react';
import styles from './LaboratoryForm.module.css';
import { createLaboratoryTest } from './laboratoryService';

const LaboratoryForm = () => {
  const [formData, setFormData] = useState({
    testName: '',
    testId: '',
    patientName: '',
    status: '',
    testDate: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLaboratoryTest(formData);
      alert('Test created');
    } catch (error) {
      alert('Error creating test');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="testName"
        placeholder="Test Name"
        value={formData.testName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="testId"
        placeholder="Test ID"
        value={formData.testId}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="patientName"
        placeholder="Patient Name"
        value={formData.patientName}
        onChange={handleChange}
        required
      />
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
      >
        <option value="">Select Status</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <input
        type="date"
        name="testDate"
        value={formData.testDate}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default LaboratoryForm;
