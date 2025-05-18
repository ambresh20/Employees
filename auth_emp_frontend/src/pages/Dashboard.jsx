import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="px-6 py-4 bg-white rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Welcome to Admin Panel</h2>
            <p className="text-gray-600">Hello, {user?.userName}</p>
          </div>
          
          {/* Nested Routes */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
