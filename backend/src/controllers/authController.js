const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password });
  return res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token: generateToken(user._id),
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token: generateToken(user._id),
  });
};

module.exports = {
  register,
  login,
};
