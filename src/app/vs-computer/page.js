'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import TicTacToeBoard from '@/components/TicTacToeBoard';
import DifficultySelector from '@/components/DifficultySelector';
import { getBestMove } from '@/lib/computerAI';

const VsComputerPage = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [computerSymbol, setComputerSymbol] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [gameState, setGameState] = useState('setup'); // 'setup', 'playing', 'ended'
  const [winner, setWinner] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);

  useEffect(() => {
    if (gameState === 'playing' && currentTurn === computerSymbol) {
      const timer = setTimeout(makeComputerMove, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState, currentTurn, computerSymbol]);

  const handleCellClick = (index) => {
    if (board[index] || gameState !== 'playing' || currentTurn !== playerSymbol) return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);
    setCurrentTurn(computerSymbol);

    checkGameState(newBoard, playerSymbol);
  };

  const makeComputerMove = () => {
    const newBoard = [...board];
    const availableMoves = newBoard.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
    
    if (availableMoves.length > 0) {
      const move = getBestMove(newBoard, difficulty, computerSymbol, playerSymbol);
      newBoard[move] = computerSymbol;
      setBoard(newBoard);
      setCurrentTurn(playerSymbol);

      checkGameState(newBoard, computerSymbol);
    }
  };

  const checkGameState = (newBoard, currentSymbol) => {
    if (checkWinner(newBoard)) {
      endGame(currentSymbol);
    } else if (newBoard.every((cell) => cell !== null)) {
      endGame(null);
    }
  };

  const startGame = (symbol) => {
    setPlayerSymbol(symbol);
    setComputerSymbol(symbol === 'X' ? 'O' : 'X');
    setGameState('playing');
    setBoard(Array(9).fill(null));
    setWinner(null);
    setCurrentTurn('X');  // X always goes first
  };

  const endGame = (winner) => {
    setGameState('ended');
    setWinner(winner);
  };

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

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-8">Vs Computer</h1>
      {gameState === 'setup' && (
        <>
          <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />
          <div className="mt-4 space-x-4">
            <Button onClick={() => startGame('X')}>Play as X</Button>
            <Button onClick={() => startGame('O')}>Play as O</Button>
          </div>
        </>
      )}
      {gameState === 'playing' && (
        <>
          <TicTacToeBoard 
            board={board} 
            onCellClick={handleCellClick} 
            playerSymbol={playerSymbol}
            computerSymbol={computerSymbol}
          />
          <p className="mt-4">Current turn: {currentTurn}</p>
        </>
      )}
      {gameState === 'ended' && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {winner ? `${winner === playerSymbol ? 'You Win!' : 'You Lose!'}` : 'It\'s a Draw!'}
          </h2>
          <Button onClick={() => setGameState('setup')}>Play Again</Button>
        </div>
      )}
      <Button className="mt-8" onClick={() => window.history.back()}>Back to Menu</Button>
    </motion.div>
  );
};

export default VsComputerPage;