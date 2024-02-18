const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');

const db = mysql.createPool({
    connectionLimit: 10,
    host: '',
    user: '',
    password: '',
    database: ''
});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Rota de Login
router.post('/', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            return res.status(500).send('Erro interno no servidor');
        }

        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (err, match) => {
                if (err) {
                    console.error('Erro ao comparar senhas:', err);
                    return res.status(500).send('Erro interno no servidor');
                }

                if (match) {
                    res.send('Login bem-sucedido!');
                } else {
                    res.send('Senha incorreta!');
                }
            });
        } else {
            res.send('Usuário não encontrado!');
        }
    });
});

module.exports = router;
