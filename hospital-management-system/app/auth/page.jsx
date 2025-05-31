"use client";

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import styles from './LoginForm.module.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.authTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
      {isLogin ? <LoginForm /> : <RegisterForm />}
      <p className={styles.toggleLink}>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button onClick={() => setIsLogin(!isLogin)} className={styles.toggleButton}>
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
}