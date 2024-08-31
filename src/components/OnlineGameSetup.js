import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const OnlineGameSetup = ({ onCreateGame, onJoinGame }) => {
  const [gameCode, setGameCode] = useState('');

  return (
    <div className="space-y-4">
      <Button onClick={onCreateGame}>Create Game</Button>
      <div className="flex space-x-2">
        <Input
          placeholder="Enter game code"
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
        />
        <Button onClick={() => onJoinGame(gameCode)}>Join Game</Button>
      </div>
    </div>
  );
};

export default OnlineGameSetup;