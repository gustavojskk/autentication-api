const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const recoverPasswordRoute = require('./routes/recover-password');

app.use('/register', express.static(path.join(__dirname, 'public')));
app.use('/login', express.static(path.join(__dirname, 'public')));
app.use('/recover-password', express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
app.use('/api/recover-password', recoverPasswordRoute);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
