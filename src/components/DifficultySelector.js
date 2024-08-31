import React from 'react';
import { Button } from '@/components/ui/button';

const DifficultySelector = ({ difficulty, setDifficulty }) => {
  return (
    <div className="space-x-4">
      <Button 
        variant={difficulty === 'easy' ? 'default' : 'outline'}
        onClick={() => setDifficulty('easy')}
      >
        Easy
      </Button>
      <Button 
        variant={difficulty === 'medium' ? 'default' : 'outline'}
        onClick={() => setDifficulty('medium')}
      >
        Medium
      </Button>
      <Button 
        variant={difficulty === 'hard' ? 'default' : 'outline'}
        onClick={() => setDifficulty('hard')}
      >
        Hard
      </Button>
    </div>
  );
};

export default DifficultySelector;