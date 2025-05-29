"use client";

import React from 'react';
import DashboardOverview from './dashboard/DashboardOverview';

export default function Home() {
  return (
    <div className="flex min-h-screen">
    
      <div className="flex-1">
        
        <main className="p-6">
          <DashboardOverview />
        </main>
      </div>
    </div>
  );
}