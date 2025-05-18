const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  
  if (!bearerHeader) {
	return res.status(403).json({ message: 'No token provided' });
  }
  
  const bearer = bearerHeader.split(' ');
  const token = bearer[1];
  
  try {
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	req.user = decoded;
	next();
  } catch (error) {
	return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { verifyToken }; 
