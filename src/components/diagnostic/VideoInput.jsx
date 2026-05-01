import React, { useState } from 'react';
import { Search, Youtube, AlertCircle } from 'lucide-react';

export default function VideoInput({ onAnalyze, isLoading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        
        <div className="relative flex flex-col md:flex-row gap-3 bg-card/50 backdrop-blur-xl border border-primary/20 p-2 rounded-2xl">
          <div className="relative flex-1 flex items-center">
            <div className="absolute left-4 text-muted-foreground">
              <Youtube className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="YouTube動画のURLを入力..."
              className="w-full bg-transparent border-none focus:ring-0 pl-12 pr-4 py-3 text-sm md:text-base text-foreground placeholder:text-muted-foreground/50 font-serif-jp"
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-serif-jp font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 whitespace-nowrap"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span className="hidden md:inline">診断開始</span>
          </button>
        </div>
      </form>
      
      <div className="mt-4 flex items-center justify-center gap-6 text-[10px] md:text-xs text-muted-foreground/40 font-display tracking-[0.2em]">
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-primary/40"></span>
          M-1 RELATIVE EVALUATION
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-primary/40"></span>
          REAL-TIME ANALYSIS
        </span>
      </div>
    </div>
  );
}
