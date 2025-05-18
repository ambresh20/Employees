// import React, { useState, useEffect } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import CreateEmployee from './pages/CreateEmployee';
import EditEmployee from './pages/EditEmployee';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Set default axios base URL
axios.defaults.baseURL = 'http://localhost:5000/api';

// Axios interceptor to add authentication token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios interceptor to handle unauthorized responses
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

function App() {
  return (
    <Router>
      <AuthProvider>

        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
            <Route index element={<Navigate to="/employees" replace />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/create" element={<CreateEmployee />} />
            <Route path="employees/edit/:id" element={<EditEmployee />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </AuthProvider>
    </Router>
  );
}

export default App;
