let players = [];
let gameStarted = false;
let currentPlayer = null;
let roomCode = '';

// دالة إنشاء الغرفة
function createRoom() {
  const playerName = document.getElementById('playerName').value;
  if (playerName.trim() === "") {
    alert("من فضلك أدخل اسمك");
    return;
  }

  // إنشاء رمز غرفة عشوائي
  roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  players.push({ name: playerName, role: "host", isAlive: true, id: Date.now() });

  // إخفاء شاشة الترحيب وعرض غرفة الانتظار
  document.getElementById('welcomeScreen').classList.add('hidden');
  document.getElementById('joinRoomScreen').classList.add('hidden');
  document.getElementById('waitingRoomScreen').classList.remove('hidden');
  document.getElementById('roomCodeDisplay').textContent = `رمز الغرفة: ${roomCode}`;
  displayPlayers();
}

// دالة عرض شاشة الانضمام للغرفة
function showJoinRoom() {
  document.getElementById('welcomeScreen').classList.add('hidden');
  document.getElementById('joinRoomScreen').classList.remove('hidden');
}

// دالة الانضمام إلى الغرفة
function joinRoom() {
  const playerName = document.getElementById('playerName').value;
  const enteredRoomCode = document.getElementById('roomCode').value;

  if (playerName.trim() === "" || enteredRoomCode.trim() === "") {
    alert("من فضلك أدخل اسمك ورمز الغرفة");
    return;
  }

  if (enteredRoomCode !== roomCode) {
    alert("رمز الغرفة غير صحيح");
    return;
  }

  players.push({ name: playerName, role: "player", isAlive: true, id: Date.now() });

  // إخفاء شاشة الانضمام وعرض غرفة الانتظار
  document.getElementById('joinRoomScreen').classList.add('hidden');
  document.getElementById('waitingRoomScreen').classList.remove('hidden');
  document.getElementById('roomCodeDisplay').textContent = `رمز الغرفة: ${roomCode}`;
  displayPlayers();
}

// دالة عرض قائمة اللاعبين
function displayPlayers() {
  const playersList = document.getElementById('playersList');
  playersList.innerHTML = '';

  players.forEach(player => {
    const li = document.createElement('li');
    li.textContent = player.name + (player.role === 'host' ? " (المنشئ)" : "");
    playersList.appendChild(li);
  });

  // إظهار زر "بدء اللعبة" إذا كان هناك 4 لاعبين على الأقل
  if (players.length >= 4 && !gameStarted) {
    document.getElementById('startGameButton').classList.remove('hidden');
  }
}

// دالة بدء اللعبة
function startGame() {
  if (players.length < 4) {
    alert("يجب أن يكون هناك 4 لاعبين على الأقل للبدء");
    return;
  }

  gameStarted = true;
  document.getElementById('waitingRoomScreen').classList.add('hidden');
  document.getElementById('gameScreen').classList.remove('hidden');
  document.getElementById('gamePhase').textContent = "الليل";

  // تخصيص الأدوار عشوائيًا (المافيا، الطبيب، المواطنون، إلخ)
  players = players.map((player, index) => {
    if (index === 0) player.role = "mafia";
    else if (index === 1) player.role = "doctor";
    else player.role = "citizen";
    return player;
  });

  displayPlayersInGame();
}

// دالة عرض اللاعبين في اللعبة
function displayPlayersInGame() {
  const playersListInGame = document.getElementById('playersListInGame');
  playersListInGame.innerHTML = '';

  players.forEach(player => {
    const li = document.createElement('li');
    li.textContent = `${player.name} - ${player.role}`;
    playersListInGame.appendChild(li);
  });
}
