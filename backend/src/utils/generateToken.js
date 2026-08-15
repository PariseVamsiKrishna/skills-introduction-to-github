const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

module.exports = generateToken;
