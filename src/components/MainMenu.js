import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const MainMenu = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Image
        src="/images/tic-tac-toe.png"
        alt="Tic-Tac-Toe"
        width={200}
        height={200}
        className="mb-8"
      />
      <h1 className="text-4xl font-bold mb-8">Tic-Tac-Toe</h1>
      <div className="space-y-4 justify-between">
        <Link href="/vs-computer">
          <Button className="w-48 bg-gray-900 hover:bg-black rounded-lg p-2 mr-4 transition-all shadow-sm">Vs Computer</Button>
        </Link>
        <Link href="/play-online">
          <Button className="w-48 bg-gray-900 hover:bg-black rounded-lg p-2 transition-all shadow-sm">Play Online</Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default MainMenu;