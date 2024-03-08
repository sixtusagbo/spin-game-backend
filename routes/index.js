var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/status', function (req, res, next) {
  res.json({ active: true });
});

router.get('/db-status', function (req, res, next) {
  res.json({ active: false });
});

module.exports = router;
