import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Users, MessageSquare, Award } from 'lucide-react';

export default function DiagnosticResult({ videoData, cvr, rank, analysis }) {
  const getRankColor = (r) => {
    switch (r) {
      case 'S': return 'text-primary';
      case 'A': return 'text-amber-400';
      case 'B': return 'text-slate-300';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <span className="text-xs font-display text-primary/60 tracking-[0.3em] italic">DIAGNOSTIC REPORT</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      {/* Main Result Card */}
      <div className="relative group">
        <div className="absolute -inset-px bg-gradient-to-b from-primary/20 to-transparent rounded-3xl blur-sm" />
        <div className="relative bg-card/40 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 md:p-10 overflow-hidden">
          {/* Background Ornament */}
          <div className={`absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 text-[12rem] font-display font-black opacity-[0.03] select-none ${getRankColor(rank)}`}>
            {rank}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-display text-muted-foreground tracking-widest mb-2 uppercase">Overall Rank</h3>
                <div className="flex items-baseline gap-4">
                  <span className={`text-8xl font-display font-black tracking-tighter ${getRankColor(rank)}`}>
                    {rank}
                  </span>
                  <span className="text-xl font-serif-jp text-muted-foreground/60 italic">Rank</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-display text-muted-foreground uppercase tracking-wider">Engagement CVR</p>
                    <p className="text-xl font-display font-bold text-foreground">{(cvr * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
              <img src={videoData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-sm font-serif-jp font-medium text-white line-clamp-2 leading-relaxed">
                  {videoData.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Analysis */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-card/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-serif-jp font-bold text-foreground tracking-wide">戦略的分析レポート</h4>
          </div>
          <div className="space-y-6">
            {analysis.map((point, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-primary font-display font-bold text-lg leading-none opacity-50">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-sm md:text-base font-serif-jp text-muted-foreground leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
