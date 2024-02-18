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

// Rota de Cadastro
router.post('/', (req, res) => {
    console.log('Recebendo requisição de cadastro...');
    const { username, email, password } = req.body;

    // Adquirir uma conexão do pool
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Erro ao obter conexão do pool:', err);
            return res.status(500).send('Erro interno no servidor');
        }

        // Inicia a transação
        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                console.error('Erro ao iniciar transação:', err);
                return res.status(500).send('Erro interno no servidor');
            }

            // Verificar se o e-mail já está registrado
            connection.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
                if (err) {
                    connection.rollback(() => {
                        connection.release();
                        console.error('Erro ao verificar e-mail:', err);
                        return res.status(500).send('Erro interno no servidor');
                    });
                }

                if (result.length > 0) {
                    // E-mail já registrado
                    connection.rollback(() => {
                        connection.release();
                        res.status(400).send('E-mail já cadastrado!');
                    });
                } else {
                    // Verificar se o usuário já está registrado
                    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
                        if (err) {
                            connection.rollback(() => {
                                connection.release();
                                console.error('Erro ao verificar usuário:', err);
                                return res.status(500).send('Erro interno no servidor');
                            });
                        }

                        if (result.length > 0) {
                            // Usuário já registrado
                            connection.rollback(() => {
                                connection.release();
                                res.status(400).send('Usuário já registrado. Escolha outro nome de usuário.');
                            });
                        } else {
                            // Se o e-mail e o usuário não estiverem registrados, proceda com o cadastro
                            bcrypt.hash(password, 10, (err, hash) => {
                                if (err) {
                                    connection.rollback(() => {
                                        connection.release();
                                        console.error('Erro ao gerar hash:', err);
                                        return res.status(500).send('Erro interno no servidor');
                                    });
                                }

                                connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                                    [username, email, hash],
                                    (err, result) => {
                                        if (err) {
                                            connection.rollback(() => {
                                                connection.release();
                                                console.error('Erro ao inserir usuário no banco de dados:', err);
                                                return res.status(500).send('Erro interno no servidor');
                                            });
                                        }

                                        // Commit da transação se tudo estiver OK
                                        connection.commit((err) => {
                                            if (err) {
                                                connection.rollback(() => {
                                                    connection.release();
                                                    console.error('Erro ao realizar commit:', err);
                                                    return res.status(500).send('Erro interno no servidor');
                                                });
                                            }

                                            console.log('Usuário registrado com sucesso!');
                                            res.send('Usuário registrado com sucesso!');

                                            // Libera a conexão de volta ao pool
                                            connection.release();
                                        });
                                    }
                                );
                            });
                        }
                    });
                }
            });
        });
    });
});

module.exports = router;
