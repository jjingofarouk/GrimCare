"use client";
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import styles from './layout.module.css';

const DoctorLayout = ({ children }) => {
  return (
    <Box className={styles.container}>
      <AppBar position="static" color="primary" className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <Typography variant="h6" className={styles.title}>
            Doctor Management - Uganda Health System
          </Typography>
        </Toolbar>
      </AppBar>
      <Box className={styles.content}>
        {children}
      </Box>
    </Box>
  );
};

export default DoctorLayout;