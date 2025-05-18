const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  id: {
	type: Number,
	unique: true
  },
  image: {
	type: String,
	required: [true, 'Employee image is required']
  },
  name: {
	type: String,
	required: [true, 'Employee name is required'],
	trim: true
  },
  email: {
	type: String,
	required: [true, 'Email is required'],
	unique: true,
	trim: true,
	lowercase: true,
	match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  mobile: {
	type: String,
	required: [true, 'Mobile number is required'],
	match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  designation: {
	type: String,
	required: [true, 'Designation is required'],
	enum: ['HR', 'Manager', 'Sales', 'Software Developer', 'Web Developer']
  },
  gender: {
	type: String,
	required: [true, 'Gender is required'],
	enum: ['Male', 'Female']
  },
  course: {
	type: [String],
	required: [true, 'At least one course is required'],
	validate: {
	  validator: function(array) {
		if (!array || array.length === 0) return false;
		const allowedCourses = ['MCA', 'BCA', 'BSC', 'B.Tech'];
		return array.every(item => allowedCourses.includes(item));
	  },
	  message: 'Courses must be one or more of: MCA, BCA, BSC'
	}
  },
  createDate: {
	type: Date,
	default: Date.now
  },
  isActive: {
	type: Boolean,
	default: true
  }
}, { timestamps: true });

// Auto-increment id field
EmployeeSchema.pre('save', async function(next) {
  if (!this.id) {
	const lastEmployee = await this.constructor.findOne({}, {}, { sort: { 'id': -1 } });
	this.id = lastEmployee ? lastEmployee.id + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Employee', EmployeeSchema); 
