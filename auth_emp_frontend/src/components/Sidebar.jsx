import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'; 

const Sidebar = () => {
  const location = useLocation();
  
  // Helper to determine if link is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="bg-white shadow-md w-64 hidden sm:block">
      <div className="p-4 border-b">
        <img
          className="h-8 w-auto mx-auto"
          src={logo}
          alt="Logo"
        />
      </div>
      <nav className="mt-5">
        <Link
          to="/"
          className={`flex items-center py-3 px-6 hover:bg-gray-100 ${
            isActive('/') && !isActive('/employees') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </Link>
        <Link
          to="/employees"
          className={`flex items-center py-3 px-6 hover:bg-gray-100 ${
            isActive('/employees') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Employee List
        </Link>
        <Link
          to="/employees/create"
          className={`flex items-center py-3 px-6 hover:bg-gray-100 ${
            location.pathname === '/employees/create' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Create Employee
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
