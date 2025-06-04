// app/auth/register/page.js
"use client";

import React from 'react';
import { Suspense } from 'react';
import RegisterForm from '../RegisterForm';

// Loading component for better UX
function RegisterFormSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-md">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg mb-6"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded-2xl"></div>
            <div className="h-12 bg-gray-200 rounded-2xl"></div>
            <div className="h-12 bg-gray-200 rounded-2xl"></div>
            <div className="h-12 bg-gray-200 rounded-2xl"></div>
            <div className="h-14 bg-gray-300 rounded-2xl mt-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="register-page">
      <Suspense fallback={<RegisterFormSkeleton />}>
        <RegisterForm />
      </Suspense>
    </main>
  );
}