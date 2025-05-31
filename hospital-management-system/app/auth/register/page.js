// app/auth/register/page.js
"use client";

import React from 'react';
import { Suspense } from 'react';
import RegisterForm from '../RegisterForm';
import Head from 'next/head';

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
    <>
      <Head>
        <title>Create Account | Healthcare Management System</title>
        <meta name="description" content="Create your account to access our healthcare management platform. Join thousands of healthcare professionals." />
        <meta name="keywords" content="healthcare, registration, account, medical, hospital, clinic" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Create Account | Healthcare Management" />
        <meta property="og:description" content="Join our healthcare management platform today" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/auth/register" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Create Account | Healthcare Management" />
        <meta name="twitter:description" content="Join our healthcare management platform today" />
        
        {/* Theme Color for Mobile Browsers */}
        <meta name="theme-color" content="#667eea" />
        <meta name="msapplication-navbutton-color" content="#667eea" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>

      <main className="register-page">
        <Suspense fallback={<RegisterFormSkeleton />}>
          <RegisterForm />
        </Suspense>
      </main>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Registration Page",
            "description": "Create account for healthcare management system",
            "url": "/auth/register",
            "isPartOf": {
              "@type": "WebSite",
              "name": "Healthcare Management System"
            },
            "mainEntity": {
              "@type": "RegisterAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "/auth/register"
              }
            }
          })
        }}
      />
    </>
  );
}

// Export metadata for Next.js 13+ App Router
export const metadata = {
  title: 'Create Account | Healthcare Management System',
  description: 'Create your account to access our healthcare management platform. Join thousands of healthcare professionals.',
  keywords: ['healthcare', 'registration', 'account', 'medical', 'hospital', 'clinic'],
  authors: [{ name: 'Healthcare Management Team' }],
  openGraph: {
    title: 'Create Account | Healthcare Management',
    description: 'Join our healthcare management platform today',
    type: 'website',
    url: '/auth/register',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Account | Healthcare Management',
    description: 'Join our healthcare management platform today',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/auth/register',
  },
};