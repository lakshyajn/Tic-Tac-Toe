'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TicTacToeBoard from '@/components/TicTacToeBoard';
import { useSocket } from '@/lib/websocket';
import { toast } from 'react-hot-toast';

const PlayOnlinePage = () => {
  const [gameState, setGameState] = useState('setup'); // 'setup', 'waiting', 'playing', 'ended'
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [inviteCode, setInviteCode] = useState('');
  const [winner, setWinner] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('gameCreated', ({ code }) => {
      setInviteCode(code);
      setGameState('waiting');
      toast.success(`Game created! Invite code: ${code}`);
    });

    socket.on('gameStart', ({ symbol, code }) => {
      setPlayerSymbol(symbol);
      setInviteCode(code);
      setGameState('playing');
      setCurrentTurn('X');
      toast.success('Game started!');
    });

    socket.on('move', ({ index, symbol }) => {
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[index] = symbol;
        return newBoard;
      });
      setCurrentTurn(symbol === 'X' ? 'O' : 'X');
    });

    socket.on('gameOver', ({ winner }) => {
      setWinner(winner);
      setGameState('ended');
    });

    socket.on('invalidCode', () => {
      toast.error('Invalid invite code. Please try again.');
    });

    socket.on('gameFull', () => {
      toast.error('This game is already full.');
    });

    return () => {
      socket.off('gameCreated');
      socket.off('gameStart');
      socket.off('move');
      socket.off('gameOver');
      socket.off('invalidCode');
      socket.off('gameFull');
    };
  }, [socket]);

  const handleCellClick = (index) => {
    if (board[index] || gameState !== 'playing' || currentTurn !== playerSymbol) return;

    socket.emit('move', { index, symbol: playerSymbol });
  };

  const createGame = () => {
    socket.emit('createGame');
  };

  const joinGame = () => {
    if (inviteCode.length !== 4) {
      toast.error('Invite code must be 4 characters long.');
      return;
    }
    socket.emit('joinGame', { code: inviteCode });
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast.success('Invite code copied to clipboard!');
  };

  const playAgain = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setGameState('setup');
    setInviteCode('');
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-8">Play Online</h1>
      {gameState === 'setup' && (
        <div className="space-y-4">
          <Button onClick={createGame}>Create Game</Button>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              maxLength={4}
            />
            <Button onClick={joinGame}>Join Game</Button>
          </div>
        </div>
      )}
      {gameState === 'waiting' && (
        <div className="text-center">
          <p className="mb-4">Waiting for opponent...</p>
          <p className="mb-2">Your invite code:</p>
          <div className="flex items-center space-x-2">
            <Input value={inviteCode} readOnly className="text-center font-bold" />
            <Button onClick={copyInviteCode}>Copy</Button>
          </div>
        </div>
      )}
      {gameState === 'playing' && (
        <>
          <p className="mb-4">Game Code: {inviteCode}</p>
          <p className="mb-4">You are playing as {playerSymbol}</p>
          <p className="mb-4">Current turn: {currentTurn}</p>
          <TicTacToeBoard 
            board={board} 
            onCellClick={handleCellClick} 
            playerSymbol={playerSymbol} 
            computerSymbol={playerSymbol === 'X' ? 'O' : 'X'}
          />
        </>
      )}
      {gameState === 'ended' && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {winner ? `${winner === playerSymbol ? 'You Win!' : 'You Lose!'}` : 'It\'s a Draw!'}
          </h2>
          <Button onClick={playAgain}>Play Again</Button>
        </div>
      )}
      <Button className="mt-8" onClick={() => window.history.back()}>Back to Menu</Button>
    </motion.div>
  );
};

export default PlayOnlinePage;