const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'Unauthorized' }); // if there isn't any token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err || !user?.id) return res.status(403).json({ error: 'Forbidden' });
    req.userId = user.id;
    next(); // pass the execution off to whatever request the client intended
  });
};

module.exports = authenticateToken;
