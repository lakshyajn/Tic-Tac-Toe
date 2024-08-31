const { checkWinner, isBoardFull, getAvailableMoves } = require('../src/lib/gameLogic');

class Game {
  constructor(player1, player2 = null) {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.player1 = player1;
    this.player2 = player2;
    this.winner = null;
    this.isDraw = false;
  }

  makeMove(index, player) {
    if (this.board[index] === null && !this.winner && !this.isDraw) {
      this.board[index] = player;
      this.checkGameStatus();
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
      return true;
    }
    return false;
  }

  checkGameStatus() {
    const winner = checkWinner(this.board);
    if (winner) {
      this.winner = winner;
    } else if (isBoardFull(this.board)) {
      this.isDraw = true;
    }
  }

  getGameState() {
    return {
      board: this.board,
      currentPlayer: this.currentPlayer,
      winner: this.winner,
      isDraw: this.isDraw,
    };
  }

  computerMove() {
    if (this.currentPlayer === 'O' && !this.winner && !this.isDraw) {
      const availableMoves = getAvailableMoves(this.board);
      if (availableMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const computerMove = availableMoves[randomIndex];
        this.makeMove(computerMove, 'O');
      }
    }
  }
}

class GameManager {
  constructor() {
    this.games = new Map();
  }

  createGame(player1, player2 = null) {
    const gameId = this.generateGameId();
    const game = new Game(player1, player2);
    this.games.set(gameId, game);
    return gameId;
  }

  getGame(gameId) {
    return this.games.get(gameId);
  }

  removeGame(gameId) {
    this.games.delete(gameId);
  }

  generateGameId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

module.exports = {
  Game,
  GameManager,
};