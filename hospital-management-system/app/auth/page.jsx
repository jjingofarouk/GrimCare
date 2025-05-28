'use client';
import React from 'react';
import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import styles from './page.module.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button onClick={() => setIsLogin(true)} className={isLogin ? styles.active : ''}>
          Login
        </button>
        <button onClick={() => setIsLogin(false)} className={!isLogin ? styles.active : ''}>
          Register
        </button>
      </div>
      {isLogin ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}