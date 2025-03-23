
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
      <p className="text-lg mb-8">Manage your surveys and responses.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-3">My Surveys</h2>
          <p className="mb-4">Create, edit, and manage your surveys.</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View Surveys
          </button>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-3">Survey Responses</h2>
          <p className="mb-4">View and analyze responses to your surveys.</p>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            View Responses
          </button>
        </div>
      </div>
      
      <div className="mt-8">
        <Link to="/" className="text-blue-500 hover:text-blue-700">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
