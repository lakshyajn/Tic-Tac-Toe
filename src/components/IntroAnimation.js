"use client"
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const IntroAnimation = ({ onComplete }) => {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!showAnimation) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white text-6xl font-bold font-poppins"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      Tic-Tac-Toe
    </motion.div>
  );
};

export default IntroAnimation;