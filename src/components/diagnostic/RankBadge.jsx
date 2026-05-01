import React from 'react';
import { motion } from 'framer-motion';

export default function RankBadge({ rank }) {
  // ランクに応じたグラデーションカラーの定義[cite: 4]
  const colors = {
    gold: 'from-yellow-400 via-yellow-200 to-yellow-500 text-black',
    silver: 'from-slate-300 via-slate-100 to-slate-400 text-black',
    rose: 'from-rose-400 via-rose-200 to-rose-500 text-black',
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="text-center py-8"
    >
      <div className={`inline-block px-10 py-6 rounded-3xl bg-gradient-to-br ${colors[rank.color] || colors.silver} shadow-[0_0_40px_rgba(234,179,8,0.2)]`}>
        <p className="text-sm font-bold tracking-[0.2em] mb-1">CURRENT RANK</p>
        <h3 className="text-3xl font-serif-jp font-black mb-1">{rank.label}</h3>
        <p className="text-xs font-medium opacity-80">{rank.subtitle}</p>
      </div>
    </motion.div>
  );
}