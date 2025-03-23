
import React from 'react';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-6">Survey Mastery Toolkit</h1>
        <p className="text-lg mb-4">Welcome to the Survey Mastery Toolkit, your comprehensive solution for creating, managing, and analyzing surveys.</p>
        
        <div className="mt-8">
          <Link to="/dashboard" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
