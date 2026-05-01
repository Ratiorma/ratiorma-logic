import React from 'react';
export default function VideoHeader({ videoData }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center bg-card/30 p-6 rounded-2xl border border-primary/10 backdrop-blur-sm">
      <img src={videoData.thumbnailUrl} alt={videoData.title} className="w-full md:w-48 rounded-xl shadow-2xl border border-primary/20" />
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-xl font-serif-jp font-bold text-foreground mb-2 leading-tight">{videoData.title}</h2>
        <p className="text-sm text-primary/80 font-medium tracking-wide">{videoData.channelTitle}</p>
      </div>
    </div>
  );
}