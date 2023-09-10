var express = require('express');
const conectarBancoDados = require('../middlewares/conectarBD');
var router = express.Router();



/* GET users listing. */
router.get('/', conectarBancoDados, function(req, res, next) {
  
  res.send('respond with a resource 50'+process.env.TEST);
});

module.exports = router;
