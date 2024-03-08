const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const { pool } = require('../config/db');
const router = express.Router();

const getUserByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [
    username,
  ]);

  return result.rows[0];
};

const createUser = async (name, username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    'INSERT INTO users (name, username, password) VALUES ($1, $2, $3) RETURNING *',
    [name, username, hashedPassword]
  );

  return result.rows[0];
};

const authenticate = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username) return res.status(400).json({ error: 'Missing username' });

  if (!password) return res.status(400).json({ error: 'Missing password' });

  try {
    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

router.post('/login', authenticate);

module.exports = {
  jwtAuthRouter: router,
  createUser,
  getUserByUsername,
};
