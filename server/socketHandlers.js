const games = new Map();

function generateInviteCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  do {
    code = '';
    for (let i = 0; i < 4; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  } while (games.has(code));
  return code;
}

function checkWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

function isBoardFull(board) {
  return board.every((cell) => cell !== null);
}

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('createGame', () => {
      const code = generateInviteCode();
      games.set(code, { players: [socket.id], board: Array(9).fill(null), currentTurn: 'X' });
      socket.join(code);
      socket.emit('gameCreated', { code });
    });

    socket.on('joinGame', ({ code }) => {
      const game = games.get(code);
      if (!game) {
        socket.emit('invalidCode');
        return;
      }
      if (game.players.length >= 2) {
        socket.emit('gameFull');
        return;
      }
      game.players.push(socket.id);
      socket.join(code);
      
      const symbols = ['X', 'O'];
      game.players.forEach((playerId, index) => {
        io.to(playerId).emit('gameStart', { symbol: symbols[index], code });
      });
    });

    socket.on('move', ({ index, symbol }) => {
      const gameEntry = Array.from(games.entries()).find(([_, game]) => game.players.includes(socket.id));
      if (!gameEntry) return;

      const [code, game] = gameEntry;
      const currentPlayerIndex = game.players.indexOf(socket.id);
      const isPlayerTurn = (symbol === 'X' && currentPlayerIndex === 0) || (symbol === 'O' && currentPlayerIndex === 1);

      if (!isPlayerTurn || game.board[index] !== null || symbol !== game.currentTurn) return;

      game.board[index] = symbol;
      game.currentTurn = symbol === 'X' ? 'O' : 'X';

      io.to(code).emit('move', { index, symbol });

      const winner = checkWinner(game.board);
      if (winner) {
        io.to(code).emit('gameOver', { winner });
        games.delete(code);
      } else if (isBoardFull(game.board)) {
        io.to(code).emit('gameOver', { winner: null });
        games.delete(code);
      }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
      for (const [code, game] of games.entries()) {
        const playerIndex = game.players.indexOf(socket.id);
        if (playerIndex !== -1) {
          game.players.splice(playerIndex, 1);
          if (game.players.length === 0) {
            games.delete(code);
          } else {
            io.to(code).emit('playerDisconnected');
          }
          break;
        }
      }
    });
  });
};