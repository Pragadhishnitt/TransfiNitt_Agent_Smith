import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Generate JWT token
export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify JWT token middleware
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: { code: 'NO_TOKEN', message: 'No token provided' }
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      error: { code: 'INVALID_TOKEN', message: 'Invalid token' }
    });
  }
};

// Hash password
export const hashPassword = (password) => bcrypt.hash(password, 10);

// Compare password
export const comparePassword = (password, hash) => bcrypt.compare(password, hash);