import React from 'react';
import { motion } from 'framer-motion';
import VideoHeader from './VideoHeader';
import StatsDisplay from './StatsDisplay';
import RankBadge from './RankBadge';
import StrategicAnalysis from './StrategicAnalysis';

export default function DiagnosticResult({ videoData, cvr, rank, analysis }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Separator */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <span className="text-xs font-display text-primary/60 tracking-[0.3em] italic">DIAGNOSTIC REPORT</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      {/* Video Info */}
      <VideoHeader videoData={videoData} />

      {/* Rank Badge - Centered, Prominent */}
      <RankBadge rank={rank} />

      {/* Stats */}
      <StatsDisplay videoData={videoData} cvr={cvr} />

      {/* Strategic Analysis */}
      <StrategicAnalysis analysisText={analysis} />

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center pt-4"
      >
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-4" />
        <p className="text-xs font-display text-muted-foreground/40 tracking-[0.2em] italic">
          Powered by YouTube Data API v3 — Real-time Analytics
        </p>
      </motion.div>
    </motion.div>
  );
}