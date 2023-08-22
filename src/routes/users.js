var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("var:", process.env.NODE_ENV);
  res.send('respond with a resource 50');
});

module.exports = router;
