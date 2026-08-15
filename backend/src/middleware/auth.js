const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const [scheme, token] = authHeader.split(' ');
  if (!token || !['Bearer', 'Token'].includes(scheme)) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'JWT secret is not configured' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
