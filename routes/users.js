var express = require('express');
import { createUser, getAllUsers, getUserByUsername } from './jwt-auth';
const jwt = require('jsonwebtoken');
var router = express.Router();

const signup = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username) return res.status(400).json({ error: 'Missing username' });

  if (!password) return res.status(400).json({ error: 'Missing password' });

  try {
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const user = await createUser(username, password);

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

// Return all users
router.get('/', getAllUsers);

// Create a user
router.post('/create', signup);

module.exports = router;
