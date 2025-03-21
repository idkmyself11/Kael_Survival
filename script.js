// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Game Variables
let score = 0;
let health = 100;
let energy = 100;
let stage = 1;
let player = { x: 400, y: 300, size: 30, speed: 4 };
let enemies = [];
let bullets = [];
let powerUps = [];
let bossFight = false;
let gameOver = false;

// Controls
const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// Dialogue System
function showDialogue(text) {
    document.getElementById('dialogue-text').innerText = text;
    setTimeout(() => {
        document.getElementById('dialogue-text').innerText = '';
    }, 3000);
}

// Enemy Generation
function spawnEnemy() {
    const type = Math.random() < 0.8 ? 'minion' : 'elite';
    const size = type === 'minion' ? 30 : 50;
    const speed = type === 'minion' ? 2 : 3;

    enemies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: size,
        speed: speed,
        type: type
    });
}

// Power-Up Generation
function spawnPowerUp() {
    powerUps.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        effect: Math.random() < 0.5 ? 'heal' : 'energy'
    });
}

// Player Movement
function movePlayer() {
    if (keys['w']) player.y -= player.speed;
    if (keys['s']) player.y += player.speed;
    if (keys['a']) player.x -= player.speed;
    if (keys['d']) player.x += player.speed;
}

// Shooting & Power Blasts
window.addEventListener('keydown', e => {
    if (e.key === ' ') {
        bullets.push({ x: player.x, y: player.y, speed: 5 });
    }
    if (e.key === 'e' && energy >= 20) {
        bullets.push({ x: player.x, y: player.y, speed: 10, blast: true });
        energy -= 20;
    }
});

// Collision Detection
function detectCollisions() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x < enemy.x + enemy.size &&
                bullet.x + 5 > enemy.x &&
                bullet.y < enemy.y + enemy.size &&
                bullet.y + 5 > enemy.y
            ) {
                score += enemy.type === 'minion' ? 10 : 25;
                enemies.splice(eIndex, 1);
                bullets.splice(bIndex, 1);
            }
        });
    });

    enemies.forEach((enemy, eIndex) => {
        if (
            player.x < enemy.x + enemy.size &&
            player.x + player.size > enemy.x &&
            player.y < enemy.y + enemy.size &&
            player.y + player.size > enemy.y
        ) {
            health -= 10;
            enemies.splice(eIndex, 1);
            if (health <= 0) {
                document.getElementById('game-container').style.display = 'none';
                document.getElementById('game-over').style.display = 'block';
                document.getElementById('final-score').innerText = score;
            }
        }
    });
}

// Draw Elements
function drawPlayer() {
    ctx.fillStyle = '#00a8e8';
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

function drawEnemies() {
    ctx.fillStyle = '#ff3333';
    enemies.forEach(enemy => ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size));
}

function drawPowerUps() {
    ctx.fillStyle = '#57ff57';
    powerUps.forEach(power => ctx.fillRect(power.x, power.y, 20, 20));
}

// Game Update Loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();

    drawPlayer();
    drawEnemies();
    drawPowerUps();
    detectCollisions();

    enemies.forEach(enemy => enemy.y += enemy.speed);

    document.getElementById('score').textContent = score;

    requestAnimationFrame(update);
}

// Start Game
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('menu-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    update();
});
