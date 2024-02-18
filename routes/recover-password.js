const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
require('dotenv').config();

const db = mysql.createPool({
    connectionLimit: 10,
    host: '',
    user: '',
    password: '',
    database: ''
});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Função para gerar senha aleatória
function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Rota para Recuperação de Senha
router.post('/', (req, res) => {
    const { email } = req.body;

    // Gere uma senha aleatória
    const newPassword = generateRandomPassword(8);

    // Configuração do e-mail
    const mailOptions = {
        from: 'noreply@clthosting.cloud',
        to: email,
        subject: 'Redefinição de Senha',
        html: `
            <h2>Redefinição de Senha</h2>
            <p>Você solicitou a redefinição de sua senha. Abaixo está a nova senha gerada:</p>
            <p><strong>Nova Senha:</strong> ${newPassword}</p>
            <p>Recomendamos que você faça login com essa nova senha e altere para uma senha mais segura.</p>
            <a href="http://clthosting.cloud/login" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Fazer Login</a>
            <p style="margin-top: 20px; text-align: center; color: #888;">Este é um e-mail automático. Por favor, não responda a este e-mail.</p>
        `
    };

    // Envia o e-mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Erro ao enviar e-mail de recuperação de senha.');
        }

        // Hash da nova senha
        bcrypt.hash(newPassword, 10, (err, hash) => {
            if (err) {
                console.error('Erro ao gerar hash da nova senha:', err);
                return res.status(500).send('Erro ao redefinir a senha.');
            }

            // Atualize a senha no banco de dados
            db.query('UPDATE users SET password = ? WHERE email = ?',
                [hash, email],
                (err, result) => {
                    if (err) {
                        console.error('Erro ao atualizar a senha no banco de dados:', err);
                        return res.status(500).send('Erro ao redefinir a senha.');
                    }

                    console.log('E-mail enviado: ' + info.response);
                    res.send('E-mail de recuperação de senha enviado com sucesso. A senha foi redefinida.');
                }
            );
        });
    });
});

module.exports = router;
