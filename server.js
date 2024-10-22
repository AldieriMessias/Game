const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db_config');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Rota para lidar com login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.send('Login bem-sucedido');
        } else {
            res.send('Credenciais inválidas');
        }
    });
});

// Rota para lidar com a seleção de personagens e batalha
app.post('/battle', (req, res) => {
    const { character1, character2, level } = req.body;

    const query = 'SELECT * FROM characters WHERE name IN (?, ?) AND level = ?';
    db.query(query, [character1, character2, level], (err, results) => {
        if (err) throw err;

        const playerCharacters = results;
        const enemyQuery = 'SELECT * FROM characters WHERE level = ? LIMIT 2';
        db.query(enemyQuery, [level], (err, enemies) => {
            if (err) throw err;

            // Lógica simplificada para batalha
            let playerHP = playerCharacters.reduce((sum, char) => sum + char.hp, 0);
            let enemyHP = enemies.reduce((sum, char) => sum + char.hp, 0);

            // Simulação de batalha (simplificada)
            while (playerHP > 0 && enemyHP > 0) {
                enemyHP -= playerCharacters.reduce((sum, char) => sum + char.attack, 0);
                if (enemyHP <= 0) break;
                playerHP -= enemies.reduce((sum, char) => sum + char.attack, 0);
            }

            if (playerHP > 0) {
                // Vitória dos jogadores, adicionar experiência
                playerCharacters.forEach(char => {
                    char.experience += 20;
                    if (char.experience >= 100) {
                        char.level += 1;
                        char.hp = Math.floor(char.hp * 1.1);
                        char.attack = Math.floor(char.attack * 1.1);
                        char.experience = 0;
                    }
                    const updateQuery = 'UPDATE characters SET level = ?, experience = ?, hp = ?, attack = ? WHERE id = ?';
                    db.query(updateQuery, [char.level, char.experience, char.hp, char.attack, char.id], err => {
                        if (err) throw err;
                    });
                });
                res.send('Vitória! Experiência adicionada.');
            } else {
                res.send('Derrota! Tente novamente.');
            }
        });
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
