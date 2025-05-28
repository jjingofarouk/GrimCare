// components/SearchBar.jsx
'use client';
import React, { useState } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(query);
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search by name, ID, or diagnosis..."
        value={query}
        onChange={handleChange}
        aria-label="Search records"
      />
      <button type="submit" className={styles.searchButton} onClick={handleSubmit} aria-label="Search">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
