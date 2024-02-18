document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registerForm').addEventListener('submit', (event) => showForm(event, 'registerForm'));
    document.getElementById('loginForm').addEventListener('submit', (event) => showForm(event, 'loginForm'));
    document.getElementById('recoverPasswordForm').addEventListener('submit', (event) => showForm(event, 'recoverPasswordForm'));
});

function showForm(event, formId) {
    event.preventDefault();

    // Lista de IDs dos formulários
    const formIds = ['registerForm', 'loginForm', 'recoverPasswordForm'];

    // Esconde todos os formulários
    for (const id of formIds) {
        document.getElementById(id + 'Container').style.display = 'none';
    }

    // Exibe o formulário específico
    document.getElementById(formId + 'Container').style.display = 'flex';
}

function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        alert(data);
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao registrar usuário. Verifique o console para mais detalhes.');
    });
}

function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        alert(data);
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao fazer login. Verifique o console para mais detalhes.');
    });
}

function recoverPassword(event) {
    event.preventDefault();
    const email = document.getElementById('recoverPasswordEmail').value;

    fetch('/api/recover-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        alert(data);
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao recuperar senha. Verifique o console para mais detalhes.');
    });
}

// Exibe o formulário de registro por padrão ao carregar a página
showForm({ preventDefault: () => {} }, 'registerForm');
