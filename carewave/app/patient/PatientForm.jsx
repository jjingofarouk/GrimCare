
// patient/PatientForm.jsx
'use client';
import React, { useState, useEffect } from 'react';
import styles from './PatientForm.module.css';
import { createPatient, updatePatient } from './patientService';

const PatientForm = ({ patient, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    patientId: '',
    age: '',
    gender: '',
    registrationDate: '',
    referralCenter: '',
    insuranceProvider: '',
    insuranceNumber: '',
    nextOfKinName: '',
    nextOfKinContact: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    photo: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        patientId: patient.patientId || '',
        age: patient.age || '',
        gender: patient.gender || '',
        registrationDate: patient.registrationDate ? new Date(patient.registrationDate).toISOString().split('T')[0] : '',
        referralCenter: patient.referralCenter || '',
        insuranceProvider: patient.insuranceProvider || '',
        insuranceNumber: patient.insuranceNumber || '',
        nextOfKinName: patient.nextOfKinName || '',
        nextOfKinContact: patient.nextOfKinContact || '',
        emergencyContactName: patient.emergencyContactName || '',
        emergencyContactPhone: patient.emergencyContactPhone || '',
        photo: patient.photo || '',
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? URL.createObjectURL(files[0]) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (patient) {
        await updatePatient(patient.id, formData);
      } else {
        await createPatient(formData);
      }
      onSuccess();
      setFormData({
        name: '',
        patientId: '',
        age: '',
        gender: '',
        registrationDate: '',
        referralCenter: '',
        insuranceProvider: '',
        insuranceNumber: '',
        nextOfKinName: '',
        nextOfKinContact: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        photo: '',
      });
    } catch (err) {
      setError('Failed to process patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>{patient ? 'Edit Patient' : 'Register Patient'}</h2>
      <div className={styles.field}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Patient Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="patientId">Patient ID</label>
        <input
          id="patientId"
          type="text"
          name="patientId"
          placeholder="Patient ID"
          value={formData.patientId}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
          min="0"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="gender">Gender</label>
        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="registrationDate">Registration Date</label>
        <input
          id="registrationDate"
          type="date"
          name="registrationDate"
          value={formData.registrationDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="referralCenter">Referral Center (Optional)</label>
        <input
          id="referralCenter"
          type="text"
          name="referralCenter"
          placeholder="Referral Center"
          value={formData.referralCenter}
          onChange={handleChange}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="insuranceProvider">Insurance Provider (Optional)</label>
        <input
          id="insuranceProvider"
          type="text"
          name="insuranceProvider"
          placeholder="Insurance Provider"
          value={formData.insuranceProvider}
          onChange={handleChange}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="insuranceNumber">Insurance Number (Optional)</label>
        <input
          id="insuranceNumber"
          type="text"
          name="insuranceNumber"
          placeholder="Insurance Number"
          value={formData.insuranceNumber}
          onChange={handleChange}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="nextOfKinName">Next of Kin Name (Optional)</label>
        <input
          id="nextOfKinName"
          type="text"
          name="nextOfKinName"
          placeholder="Next of Kin Name"
          value={formData.nextOfKinName}
          onChange={handleChange}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="nextOfKinContact">Next of Kin Contact (Optional)</label>
        <input
          id="nextOfKinContact"
          type="tel"
          name="nextOfKinContact"
          placeholder="Next of Kin Contact"
          value={formData.nextOfKinContact}
          onChange={handleChange}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="emergencyContactName">Emergency Contact Name (Optional)</label>
        <input
          id="emergencyContactName"
          type="text"
          name="emergencyContactName"
          placeholder="Emergency Contact Name"
          value={formData.emergencyContactName}
          onChange={handleChange}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="emergencyContactPhone">Emergency Contact Phone (Optional)</label>
        <input
          id="emergencyContactPhone"
          type="tel"
          name="emergencyContactPhone"
          placeholder="Emergency Contact Phone"
          value={formData.emergencyContactPhone}
          onChange={handleChange}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="photo">Photo (Optional)</label>
        <input
          id="photo"
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
        />
        {formData.photo && (
          <img src={formData.photo} alt="Preview" className={styles.photoPreview} />
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Processing...' : patient ? 'Update Patient' : 'Register Patient'}
        </button>
        {patient && (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => onSuccess()}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default PatientForm;
