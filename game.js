// Configurações iniciais
const player = {
    position: 400,
    team: [],
    xp: 0,
    level: 1
};

const types = {
    "Fogo": { strong: ["Inseto", "Aço", "Trevas"], weak: ["Agua", "Terra"] },
    "Agua": { strong: ["Fogo", "Terra"], weak: ["Eletricidade", "Neon"] },
    "Terra": { strong: ["Eletricidade", "Fogo", "Aço"], weak: ["Agua", "Inseto"] },
    "Eletricidade": { strong: ["Agua", "Aço"], weak: ["Terra", "Antigo"] },
    "Trevas": { strong: ["Luz", "Antigo"], weak: ["Fogo", "Neon"] },
    "Luz": { strong: ["Trevas", "Neon"], weak: ["Aço", "Dragonoide"] },
    "Aço": { strong: ["Inseto", "Dragonoide"], weak: ["Fogo", "Eletricidade"] },
    "Inseto": { strong: ["Terra", "Trevas"], weak: ["Fogo", "Aço"] },
    "Dragonoide": { strong: ["Luz", "Antigo"], weak: ["Aço", "Neon"] },
    "Antigo": { strong: ["Eletricidade", "Neon"], weak: ["Trevas", "Dragonoide"] },
    "Neon": { strong: ["Agua", "Trevas"], weak: ["Luz", "Antigo"] }
};

const monsters = [
    { name: "Flameboris", type: "Fogo", level: 5, hp: 30, attacks: [{ name: "Chama", power: 10 }] },
    { name: "Aquaboris", type: "Agua", level: 5, hp: 35, attacks: [{ name: "Jato", power: 8 }] },
    // Adicione mais 98 monstros aqui
    { name: "Biridin", type: "Trevas", level: 99, hp: 500, attacks: [{ name: "Tsunami", power: 50 }] }
];

// Elementos do DOM
const worldScreen = document.getElementById("world-screen");
const battleScreen = document.getElementById("battle-screen");
const diaryScreen = document.getElementById("diary-screen");
const playerEl = document.getElementById("player");
const monstersEl = document.getElementById("monsters");

let currentEnemy = null;

// Movimento do jogador
document.getElementById("left-btn").addEventListener("click", () => movePlayer(-10));
document.getElementById("right-btn").addEventListener("click", () => movePlayer(10));
document.getElementById("diary-btn").addEventListener("click", showDiary);

function movePlayer(delta) {
    player.position = Math.max(0, Math.min(780, player.position + delta));
    playerEl.style.left = `${player.position}px`;
    checkCollision();
}

// Geração de monstros
function spawnMonsters() {
    monstersEl.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        const monster = monsters[Math.floor(Math.random() * (monsters.length - 1))];
        const monsterEl = document.createElement("div");
        monsterEl.classList.add("monster");
        monsterEl.style.left = `${Math.random() * 760}px`;
        monsterEl.dataset.monster = JSON.stringify(monster);
        monstersEl.appendChild(monsterEl);
    }
}

// Colisão com monstros
function checkCollision() {
    const monsterEls = document.querySelectorAll(".monster");
    monsterEls.forEach(monsterEl => {
        const monsterRect = monsterEl.getBoundingClientRect();
        const playerRect = playerEl.getBoundingClientRect();
        if (playerRect.left < monsterRect.right && playerRect.right > monsterRect.left) {
            currentEnemy = JSON.parse(monsterEl.dataset.monster);
            startBattle();
        }
    });
}

// Sistema de batalha
function startBattle() {
    worldScreen.classList.add("hidden");
    battleScreen.classList.remove("hidden");
    document.getElementById("enemy-monster").textContent = `${currentEnemy.name} (Nível ${currentEnemy.level})`;
    document.getElementById("player-monster").textContent = player.team.length > 0 ? 
        `${player.team[0].name} (Nível ${player.team[0].level})` : "Sem Boris!";
}

document.getElementById("attack-btn").addEventListener("click", () => {
    if (player.team.length > 0) {
        const damage = calculateDamage(player.team[0], currentEnemy);
        currentEnemy.hp -= damage;
        if (currentEnemy.hp <= 0) {
            endBattle(true);
        }
    }
});

document.getElementById("capture-btn").addEventListener("click", () => {
    if (currentEnemy.hp < 10 && Math.random() > 0.5) {
        player.team.push(currentEnemy);
        endBattle(false);
    }
});

document.getElementById("run-btn").addEventListener("click", endBattle);

function calculateDamage(attacker, defender) {
    let damage = attacker.attacks[0].power;
    if (types[attacker.type].strong.includes(defender.type)) damage *= 2;
    if (types[attacker.type].weak.includes(defender.type)) damage *= 0.5;
    return damage;
}

function endBattle(victory) {
    if (victory) {
        player.xp += currentEnemy.level * 10;
        if (player.xp >= player.level * 100) {
            player.level++;
            player.xp = 0;
        }
    }
    battleScreen.classList.add("hidden");
    worldScreen.classList.remove("hidden");
    spawnMonsters();
}

// Diário
function showDiary() {
    worldScreen.classList.add("hidden");
    diaryScreen.classList.remove("hidden");
    const diaryList = document.getElementById("diary-list");
    diaryList.innerHTML = player.team.map(boris => 
        `<p>${boris.name} - Tipo: ${boris.type} - Nível: ${boris.level}</p>`).join("");
    setTimeout(() => {
        diaryScreen.classList.add("hidden");
        worldScreen.classList.remove("hidden");
    }, 5000);
}

// Início do jogo
spawnMonsters();