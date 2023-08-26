const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = { customCssUrl: '/swagger-ui.css' };
const helmet = require('helmet'); // Importe o pacote helmet

const routes = require('./src/routes');
const authDicProducao = require('./src/middlewares/authDoc');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Adicione a CSP usando o pacote helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "cdn.example.com"], // Adicione outras fontes de estilo permitidas aqui
      // Adicione mais diretivas conforme necessário
    },
  })
);

if (process.env.NODE_ENV !== 'test') {
  var swaggerFile = require('./swagger/swagger_output.json');
  app.get('/', (req, res) => {
    /* #swagger.ignora = true */
    res.redirect('/doc');
  });
  app.use(
    '/doc',
    authDicProducao,
    swaggerUi.serve,
    swaggerUi.setup(swaggerFile, swaggerOptions)
  );
}

routes(app);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

module.exports = app;
