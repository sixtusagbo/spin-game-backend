var express = require('express');
import { updateMaxSpins, updateSpinStatus } from '../config/db';
import authenticateToken from '../middlewares/authenticateToken';
const jwt = require('jsonwebtoken');
var router = express.Router();

const updateSpin = async (req, res, next) => {
  const { outcome } = req.body;

  if (!outcome) return res.status(400).json({ error: 'Missing outcome' });

  const userId = req.userId;
  await updateSpinStatus(userId, outcome);

  return res.json({ message: 'Spin status updated' });
};

const increaseSpins = async (req, res, next) => {
  const { value } = req.body;

  if (!value) return res.status(400).json({ error: 'Missing value' });

  const userId = req.userId;
  await updateMaxSpins(userId, value);

  return res.json({ message: 'Max spins updated' });
};

// Update spin for a user
router.post('/', authenticateToken, updateSpin);

// Increase max spin for a user
router.post('/max/update', authenticateToken, increaseSpins);

module.exports = router;
