const express = require('express');
const https = require('https'); // Importe o módulo https
const fs = require('fs'); // Importe o módulo fs para ler certificados
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = { customCssUrl: '/swagger-ui/swagger-ui.css' };
const helmet = require('helmet');

const routes = require('./src/routes');
const authDicProducao = require('./src/middlewares/authDoc');

const app = express();
require('dotenv').config();

// Defina a porta correta
const PORT = process.env.PORT || 4000;

// Configuração do servidor HTTPS
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certificados', 'key.pem')), // Substitua com o caminho real para sua chave privada
  cert: fs.readFileSync(path.join(__dirname, 'certificados', 'cert.pem')), // Substitua com o caminho real para seu certificado
};

const server = https.createServer(httpsOptions, app); // Crie o servidor HTTPS

// Configure o middleware CORS para permitir solicitações de qualquer origem
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configure a CSP usando o pacote helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "cdn.example.com"],
    },
  })
);

if (process.env.NODE_ENV !== 'test') {
  const swaggerFile = require('./swagger/swagger_output.json');
  app.get('/', (req, res) => { /* #swagger.ignore = true */ res.redirect('/doc'); });

  app.use(
    '/doc/',
    authDicProducao,
    swaggerUi.serve,
    swaggerUi.setup(swaggerFile, swaggerOptions)
  );
}

routes(app);

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Servidor HTTPS rodando na porta ${PORT}`);
  });
}

module.exports = app;
