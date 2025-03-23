
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-10">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p>This is the dashboard page. Content will be added here.</p>
      </main>
      
      <Footer />
    </div>
  );
}
