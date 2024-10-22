// Lida com o envio do formulário de login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    })
    .catch(error => console.error('Erro:', error));
});

// Lida com o envio do formulário de batalha
document.getElementById('battleForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const character1 = document.getElementById('character1').value;
    const character2 = document.getElementById('character2').value;
    const level = document.getElementById('level').value;

    fetch('/battle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ character1, character2, level })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    })
    .catch(error => console.error('Erro:', error));
});
