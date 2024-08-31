'use client' 
import React, { useState, useEffect } from 'react';
import IntroAnimation from '@/components/IntroAnimation';
import MainMenu from '@/components/MainMenu';

const Home = () => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      {showIntro ? (
        <IntroAnimation onComplete={() => setShowIntro(false)} />
      ) : (
        <MainMenu />
      )}
    </div>
  );
};

export default Home;