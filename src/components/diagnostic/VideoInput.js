import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VideoInput({ onAnalyze, isLoading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/40 via-accent/30 to-primary/40 rounded-xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center bg-card border border-border rounded-xl overflow-hidden">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="YouTube URLを入力してください"
              className="flex-1 bg-transparent px-6 py-5 text-foreground font-serif-jp text-sm md:text-base placeholder:text-muted-foreground/50 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="flex items-center gap-2 px-6 md:px-8 py-5 bg-gradient-to-r from-primary/90 to-primary text-primary-foreground font-serif-jp font-medium text-sm tracking-wider transition-all duration-300 hover:from-primary hover:to-primary/80 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="hidden md:inline">診断開始</span>
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}