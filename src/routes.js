function routes(app) {
    app.use('/users', require('./routes/users'));
    // Adicione outras rotas aqui, se necessário
}

module.exports = routes;
