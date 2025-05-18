const Employee = require('../models/Employee');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const { search, sort, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Search functionality
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Sorting options
    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case 'name':
          sortOptions = { name: 1 };
          break;
        case 'name_desc':
          sortOptions = { name: -1 };
          break;
        case 'email':
          sortOptions = { email: 1 };
          break;
        case 'email_desc':
          sortOptions = { email: -1 };
          break;
        case 'id':
          sortOptions = { id: 1 };
          break;
        case 'id_desc':
          sortOptions = { id: -1 };
          break;
        case 'date': 
          sortOptions = { createDate: 1 };
          break;
        case 'date_desc':
          sortOptions = { createDate: -1 };
          break;
        default:
          sortOptions = { createDate: -1 }; // Default sort by creation date
      }
    } else {
      sortOptions = { createDate: -1 }; // Default sort
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    const employees = await Employee.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));
      
    const total = await Employee.countDocuments(query);
    
    res.status(200).json({
      employees,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalCount: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Create new employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, mobile, designation, gender, course } = req.body;
    
    // Validate required fields
    if (!name || !email || !mobile || !designation || !gender || !course) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Validate mobile format (10 digits)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ message: 'Mobile number must be 10 digits' });
    }
    
    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Parse courses from string to array if needed
    let courseArray = Array.isArray(course) ? course : course.split(',');
    
    // Check if image is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Employee image is required' });
    }

    // Ensure the uploads directory exists
    if (!fs.existsSync(path.dirname(req.file.path))) {
      fs.mkdirSync(path.dirname(req.file.path), { recursive: true });
    }
    
    const newEmployee = new Employee({
      name,
      email,
      mobile,
      designation,
      gender,
      course: courseArray,
      image: req.file.path.replace(/\\/g, '/') // Normalize path for storage
    });
    
    await newEmployee.save();
    
    res.status(201).json({ 
      message: 'Employee created successfully',
      employee: newEmployee
    });
  } catch (error) {
    // If there's an error, remove uploaded file if any
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({ id: req.params.id });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { name, email, mobile, designation, gender, course } = req.body;
    
    // Validate required fields
    if (!name || !email || !mobile || !designation || !gender || !course) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Validate mobile format (10 digits)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ message: 'Mobile number must be 10 digits' });
    }
    
    // Check if email already exists for another employee
    const existingEmployee = await Employee.findOne({ 
      email, 
      id: { $ne: req.params.id } 
    });
    
    if (existingEmployee) {
      return res.status(400).json({ message: 'Email already exists for another employee' });
    }
    
    // Parse courses from string to array if needed
    let courseArray = Array.isArray(course) ? course : course.split(',');
    
    // Find the employee to update
    const employee = await Employee.findOne({ id: req.params.id });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Update image if a new one is uploaded
    if (req.file) {
      // Delete old image
      if (employee.image) {
        fs.unlink(employee.image, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
      employee.image = req.file.path;
    }
    
    // Update other fields
    employee.name = name;
    employee.email = email;
    employee.mobile = mobile;
    employee.designation = designation;
    employee.gender = gender;
    employee.course = courseArray;
    
    await employee.save();
    
    res.status(200).json({ 
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    // If there's an error, remove uploaded file if any
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ id: req.params.id });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Delete employee image from storage
    if (employee.image) {
      fs.unlink(employee.image, (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }
    
    await Employee.deleteOne({ id: req.params.id });
    
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Toggle employee active status
exports.toggleEmployeeStatus = async (req, res) => {
  try {
    const employee = await Employee.findOne({ id: req.params.id });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    employee.isActive = !employee.isActive;
    await employee.save();
    
    res.status(200).json({ 
      message: `Employee ${employee.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: employee.isActive
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
