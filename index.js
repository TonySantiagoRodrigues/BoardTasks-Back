var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var swaggerUi = require('swagger-ui-express');
var swaggerFile = require('./swagger/swagger_output.json');
var swaggerOptions = { customCssUrl: '/swagger-ui.css'};


var usersRouter = require('./routes/users');

var app = express();
require('dotenv').config();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => { /* #swagger.ignora = true */ res.redirect('/doc')});
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile, swaggerOptions));
app.use('/users', usersRouter);

if (process.env.NODE_ENV !== 'test'){
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

module.exports = app;
