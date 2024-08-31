import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/database';
import Game from '@/models/Game';
import { getToken } from '@/lib/auth';

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

    const { gameId } = req.body;

    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.players.length === 2) {
      return res.status(400).json({ message: 'Game is full' });
    }

    game.players.push(token.userId);
    await game.save();

    res.status(200).json({ message: 'Joined game successfully' });
  } catch (error) {
    console.error('Join game error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}