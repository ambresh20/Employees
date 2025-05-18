// routes/employeeRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { 
  getAllEmployees, 
  createEmployee, 
  getEmployeeById, 
  updateEmployee, 
  deleteEmployee,
  toggleEmployeeStatus
} = require('../controllers/employeeController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only JPG and PNG files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB limit
  }
});

// Apply verifyToken middleware to all routes
router.use(verifyToken);

// Get all employees
router.get('/', getAllEmployees);

// Get employee by ID
router.get('/:id', getEmployeeById);

// Create new employee
router.post('/', upload.single('image'), createEmployee);

// Update employee
router.put('/:id', upload.single('image'), updateEmployee);

// Delete employee
router.delete('/:id', deleteEmployee);

// Toggle employee active status
router.patch('/:id/toggle-status', toggleEmployeeStatus);

module.exports = router;
