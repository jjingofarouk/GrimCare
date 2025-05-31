// app/auth/login/page.js
"use client";

import React from 'react';
import { Suspense } from 'react';
import LoginForm from '../LoginForm';
import Head from 'next/head';

// Loading component for better UX
function LoginFormSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-md">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg mb-6"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded-2xl"></div>
            <div className="h-12 bg-gray-200 rounded-2xl"></div>
            <div className="h-14 bg-gray-300 rounded-2xl mt-6"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded mt-4"></div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Sign In | Healthcare Management System</title>
        <meta name="description" content="Sign in to your healthcare management account. Access patient records, appointments, and medical data securely." />
        <meta name="keywords" content="healthcare, login, signin, medical, hospital, clinic, patient portal" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Sign In | Healthcare Management" />
        <meta property="og:description" content="Access your healthcare management account securely" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/auth/login" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sign In | Healthcare Management" />
        <meta name="twitter:description" content="Access your healthcare management account securely" />
        
        {/* Theme Color for Mobile Browsers */}
        <meta name="theme-color" content="#667eea" />
        <meta name="msapplication-navbutton-color" content="#667eea" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      <main className="login-page" role="main">
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
        
        {/* Accessibility Skip Link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
      </main>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Login Page",
            "description": "Sign in to healthcare management system",
            "url": "/auth/login",
            "isPartOf": {
              "@type": "WebSite",
              "name": "Healthcare Management System"
            },
            "mainEntity": {
              "@type": "LoginAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "/auth/login"
              }
            },
            "potentialAction": {
              "@type": "Action",
              "name": "Sign In",
              "target": "/auth/login"
            }
          })
        }}
      />
    </>
  );
}

// Export metadata for Next.js 13+ App Router
export const metadata = {
  title: 'Sign In | Healthcare Management System',
  description: 'Sign in to your healthcare management account. Access patient records, appointments, and medical data securely.',
  keywords: ['healthcare', 'login', 'signin', 'medical', 'hospital', 'clinic', 'patient portal'],
  authors: [{ name: 'Healthcare Management Team' }],
  openGraph: {
    title: 'Sign In | Healthcare Management',
    description: 'Access your healthcare management account securely',
    type: 'website',
    url: '/auth/login',
    images: [
      {
        url: '/images/login-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Healthcare Management Login',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign In | Healthcare Management',
    description: 'Access your healthcare management account securely',
    images: ['/images/login-twitter.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/auth/login',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};