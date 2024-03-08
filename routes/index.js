var express = require('express');
const pool = require('../config/db');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/status', function (req, res, next) {
  res.json({ active: true });
});

router.get('/db-status', async function (req, res, next) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    const results = { results: result ? result.rows : null };
    res.json(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.json({ error: err });
  }
});

module.exports = router;
