import React from 'react';

const ProfileStats = ({ stats }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Your Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400">Total Games</p>
          <p className="text-2xl font-bold">{stats.totalGames}</p>
        </div>
        <div>
          <p className="text-gray-400">Wins</p>
          <p className="text-2xl font-bold text-green-500">{stats.wins}</p>
        </div>
        <div>
          <p className="text-gray-400">Losses</p>
          <p className="text-2xl font-bold text-red-500">{stats.losses}</p>
        </div>
        <div>
          <p className="text-gray-400">Win Rate</p>
          <p className="text-2xl font-bold">{stats.winRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;