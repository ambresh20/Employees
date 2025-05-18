# Employees Management System

## Overview
A full-stack application for managing employee information with authentication and authorization.

## Backend

### Technology Stack
- Node.js
- Express.js
- MongoDB
- JWT for authentication

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

#### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `PATCH /api/employees/:/:id/toggle-status` - Toggle employee

### Environment Variables
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/employee_panel
JWT_SECRET=aeiou
```

## Frontend

### Technology Stack
- React.js
- Context API for state management
- Axios for API calls

### Features
- User authentication (Login/Register)
- Employee CRUD operations
- Responsive design
- Protected routes
- Form validation

### Project Structure
```
src/
├── components/
├── pages/
├── assets/
├── context/
```

## Getting Started

### Backend Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run: `npm run dev`

### Frontend Setup
1. Navigate to frontend directory: `cd auth_emp_frontend`
2. Install dependencies: `npm install`
3. Run: `npm run dev`

