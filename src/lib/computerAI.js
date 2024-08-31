// src/lib/computerAI.js

const checkWinner = (board) => {
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
  };
  
  const getAvailableMoves = (board) => {
    return board.reduce((moves, cell, index) => {
      if (cell === null) moves.push(index);
      return moves;
    }, []);
  };
  
  const minimax = (board, depth, isMaximizing, computerSymbol, playerSymbol) => {
    const winner = checkWinner(board);
    if (winner === computerSymbol) return 10 - depth;
    if (winner === playerSymbol) return depth - 10;
    if (getAvailableMoves(board).length === 0) return 0;
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let move of getAvailableMoves(board)) {
        board[move] = computerSymbol;
        let score = minimax(board, depth + 1, false, computerSymbol, playerSymbol);
        board[move] = null;
        bestScore = Math.max(score, bestScore);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let move of getAvailableMoves(board)) {
        board[move] = playerSymbol;
        let score = minimax(board, depth + 1, true, computerSymbol, playerSymbol);
        board[move] = null;
        bestScore = Math.min(score, bestScore);
      }
      return bestScore;
    }
  };
  
  export const getBestMove = (board, difficulty, computerSymbol, playerSymbol) => {
    const availableMoves = getAvailableMoves(board);
    
    if (difficulty === 'easy') {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  
    let bestScore = -Infinity;
    let bestMove;
  
    for (let move of availableMoves) {
      board[move] = computerSymbol;
      let score = minimax(board, 0, false, computerSymbol, playerSymbol);
      board[move] = null;
  
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  
    if (difficulty === 'medium') {
      const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      return Math.random() < 0.3 ? randomMove : bestMove;
    }
  
    return bestMove;
  };