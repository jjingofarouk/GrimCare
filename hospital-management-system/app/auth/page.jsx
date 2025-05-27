"use client";

import React from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Welcome</h2>
      <LoginForm />
      <p className="text-center mt-4">
        Don't have an account? <a href="/auth/register" className="text-blue-500">Register</a>
      </p>
    </div>
  );
}