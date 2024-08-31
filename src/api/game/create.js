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

    const game = new Game({
      players: [token.userId],
      board: Array(9).fill(null),
      currentTurn: token.userId,
    });

    await game.save();

    res.status(201).json({ gameId: game._id });
  } catch (error) {
    console.error('Create game error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}