const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Login user
exports.login = async (req, res) => {
  const { userName, password } = req.body;
  
  if (!userName || !password) {
	return res.status(400).json({ message: 'Please provide username and password' });
  }
  
  try {
	const user = await User.findOne({ userName });
	
	if (!user) {
	  return res.status(401).json({ message: 'Invalid login details' });
	}
	
	const isMatch = await user.comparePassword(password);
	
	if (!isMatch) {
	  return res.status(401).json({ message: 'Invalid login details' });
	}
	
	const token = jwt.sign(
	  { id: user._id, userName: user.userName },
	  process.env.JWT_SECRET,
	  { expiresIn: '1d' }
	);
	
	res.status(200).json({
	  token,
	  user: {
		id: user._id,
		userName: user.userName
	  }
	});
  } catch (error) {
	res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register user (admin only function)
exports.register = async (req, res) => {
  const { userName, password } = req.body;
  
  if (!userName || !password) {
	return res.status(400).json({ message: 'Please provide username and password' });
  }
  
  try {
	// Check if user already exists
	const existingUser = await User.findOne({ userName });
	
	if (existingUser) {
	  return res.status(400).json({ message: 'Username already exists' });
	}
	
	const newUser = new User({
	  userName,
	  password
	});
	
	await newUser.save();
	
	res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
	res.status(500).json({ message: 'Server error', error: error.message });
  }
};
