import React from 'react';
import { motion } from 'framer-motion';

const TicTacToeBoard = ({ board, onCellClick, playerSymbol, computerSymbol }) => {
  return (
    <div className="grid grid-cols-3 gap-2 w-64 h-64 rounded-md">
      {board.map((cell, index) => (
        <motion.button
          key={index}
          className={`bg-gray-700 text-white text-4xl font-bold flex items-center justify-center ${
            cell ? (cell === playerSymbol ? 'text-blue-500' : 'text-red-500') : ''
          }`}
          whileHover={{ scale: cell ? 1 : 1.05 }}
          whileTap={{ scale: cell ? 1 : 0.95 }}
          onClick={() => onCellClick(index)}
          disabled={cell !== null}
        >
          {cell}
        </motion.button>
      ))}
    </div>
  );
};

export default TicTacToeBoard;