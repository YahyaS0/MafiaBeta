/* File: script.js */
const nameRegistration = document.getElementById('name-registration');
const gameLobby = document.getElementById('game-lobby');
const gameArea = document.getElementById('game-area');
const playerNameInput = document.getElementById('player-name');
const startGameButton = document.getElementById('start-game');
const startRoundButton = document.getElementById('start-round');
const roleName = document.getElementById('role-name');
const gameLog = document.getElementById('game-log');
const voteSection = document.getElementById('vote-section');
const votePlayerSelect = document.getElementById('vote-player');
const submitVoteButton = document.getElementById('submit-vote');

let players = [];
let roles = [];
let votes = {};

startGameButton.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        players.push(playerName);
        updateLobbyInfo();
        nameRegistration.classList.add('hidden');
        gameLobby.classList.remove('hidden');
    } else {
        alert('يرجى إدخال اسمك!');
    }
});

startRoundButton.addEventListener('click', () => {
    assignRoles();
    gameLobby.classList.add('hidden');
    gameArea.classList.remove('hidden');
    logGame(`تم بدء اللعبة وتوزيع الأدوار.`);
    startNightPhase();
});

function updateLobbyInfo() {
    const lobbyInfo = document.getElementById('lobby-info');
    lobbyInfo.textContent = `اللاعبون المنضمون: ${players.join(', ')}`;
    if (players.length >= 6) {
        startRoundButton.classList.remove('hidden');
    }
}

function assignRoles() {
    const rolesPool = ['مافيا', 'مافيا', 'طبيب', 'شرطي', ...Array(players.length - 4).fill('مواطن')];
    roles = players.map(player => {
        const roleIndex = Math.floor(Math.random() * rolesPool.length);
        return { player, role: rolesPool.splice(roleIndex, 1)[0] };
    });
    const currentPlayer = roles.find(r => r.player === players[0]); // Example for the first player
    roleName.textContent = currentPlayer.role;
}

function logGame(message) {
    const logEntry = document.createElement('p');
    logEntry.textContent = message;
    gameLog.appendChild(logEntry);
}

function startNightPhase() {
    logGame('الليل بدأ. الأدوار الخاصة يمكنها الآن اتخاذ إجراءاتها.');
    // Example: Mafia chooses a target
    const mafiaPlayers = roles.filter(r => r.role === 'مافيا');
    const mafiaChoice = mafiaPlayers[0]?.player || null; // Example: First mafia player chooses
    if (mafiaChoice) {
        logGame(`اختار المافيا الهجوم على ${mafiaChoice}.`);
    }

    // Policeman asks about a player's role
    const policeman = roles.find(r => r.role === 'شرطي');
    if (policeman) {
        const suspectIndex = Math.floor(Math.random() * players.length);
        const suspect = roles.find(r => r.player === players[suspectIndex]);
        logGame(`سأل الشرطي عن دور ${suspect.player} وتلقى الإجابة: ${suspect.role}`);
    }

    // Check for win conditions
    if (checkWinConditions()) return;

    // Move to voting phase
    setTimeout(startVotingPhase, 5000); // Wait 5 seconds for night phase
}

function startVotingPhase() {
    logGame('جولة التصويت بدأت.');
    voteSection.classList.remove('hidden');
    votePlayerSelect.innerHTML = '<option value="skip">تخطّي</option>';
    players.forEach(player => {
        const option = document.createElement('option');
        option.value = player;
        option.textContent = player;
        votePlayerSelect.appendChild(option);
    });
}

submitVoteButton.addEventListener('click', () => {
    const vote = votePlayerSelect.value;
    votes[vote] = (votes[vote] || 0) + 1;
    logGame(`تم التصويت لصالح: ${vote === 'skip' ? 'تخطّي' : vote}`);
    if (Object.keys(votes).length === players.length) {
        endVotingPhase();
    }
});

function endVotingPhase() {
    const votedOut = Object.entries(votes).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    if (votedOut === 'skip') {
        logGame('تم تخطي التصويت هذا الدور.');
    } else {
        logGame(`${votedOut} تم إخراجه من اللعبة.`);
        players = players.filter(player => player !== votedOut);
        roles = roles.filter(role => role.player !== votedOut);
    }
    votes = {};

    if (!checkWinConditions()) {
        startNightPhase();
    }
}

function checkWinConditions() {
    const mafiaCount = roles.filter(r => r.role === 'مافيا').length;
    const citizenCount = roles.length - mafiaCount;

    if (mafiaCount >= citizenCount) {
        logGame('فاز المافيا!');
        return true;
    } else if (mafiaCount === 0) {
        logGame('فاز المواطنون!');
        return true;
    }
    return false;
}