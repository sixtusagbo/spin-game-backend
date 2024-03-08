var express = require('express');
import { getUserById, selectAllUsers } from '../config/db';
import authenticateToken from '../middlewares/authenticateToken';
import { createUser, getUserByUsername } from './jwt-auth';
const jwt = require('jsonwebtoken');
var router = express.Router();

const signup = async (req, res, next) => {
  const { name, username, password } = req.body;

  if (!name) return res.status(400).json({ error: 'Missing name' });
  if (!username) return res.status(400).json({ error: 'Missing username' });
  if (!password) return res.status(400).json({ error: 'Missing password' });

  try {
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const user = await createUser(name, username, password);

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res
      .status(201)
      .json({ token, id: payload.id, spins: user.max_spins - user.spins });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const result = await selectAllUsers();

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getSingleUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await getUserById(userId);

    res.json(user);
  } catch (error) {
    next(error);
  }
};

router.get('/me', authenticateToken, getSingleUser);

// Return all users
router.get('/', authenticateToken, getAllUsers);

// Create a user
router.post('/create', signup);

module.exports = router;
