import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/database';
import Game from '@/models/Game';
import { getToken } from '@/lib/auth';
import { checkWinner, isBoardFull } from '@/lib/gameLogic';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { gameId, index } = req.body;

    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.currentTurn.toString() !== token.userId) {
      return res.status(400).json({ message: 'Not your turn' });
    }

    if (game.board[index] !== null) {
      return res.status(400).json({ message: 'Invalid move' });
    }

    const playerSymbol = game.players[0].toString() === token.userId ? 'X' : 'O';
    game.board[index] = playerSymbol;
    game.currentTurn = game.players.find(p => p.toString() !== token.userId);

    const winner = checkWinner(game.board);
    if (winner) {
      game.winner = token.userId;
    } else if (isBoardFull(game.board)) {
      game.isDraw = true;
    }

    await game.save();

    res.status(200).json({ 
      board: game.board, 
      currentTurn: game.currentTurn,
      winner: game.winner,
      isDraw: game.isDraw
    });
  } catch (error) {
    console.error('Game move error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}