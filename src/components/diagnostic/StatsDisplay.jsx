import React from 'react';

export default function StatsDisplay({ videoData, cvr }) {
  const stats = [
    { label: 'VIEWS', value: videoData.viewCount.toLocaleString() },
    { label: 'LIKES', value: videoData.likeCount.toLocaleString() },
    { label: 'CVR', value: `${cvr.toFixed(2)}%`, highlight: true },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((s) => (
        <div key={s.label} className={`p-4 rounded-xl border border-primary/10 bg-card/20 ${s.highlight ? 'ring-1 ring-primary/30' : ''}`}>
          <p className="text-[10px] font-display text-muted-foreground tracking-widest mb-1">{s.label}</p>
          <p className={`text-2xl font-display font-bold ${s.highlight ? 'text-primary' : 'text-foreground'}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}