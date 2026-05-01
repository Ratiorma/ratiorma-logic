import React from 'react';

export default function StrategicAnalysis({ analysisText }) {
  return (
    <div className="bg-card/40 border border-primary/20 rounded-2xl p-8 relative overflow-hidden">
      {/* デザインのアクセントとしての左端のライン */}
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
      
      <h4 className="text-xs font-display text-primary tracking-[0.3em] mb-4 italic">
        STRATEGIC ANALYSIS
      </h4>
      
      <div className="text-sm md:text-base font-serif-jp text-foreground/90 leading-loose whitespace-pre-wrap">
        {analysisText}
      </div>
      
      {/* 背景に薄くロゴのような装飾を配置 */}
      <div className="absolute -bottom-4 -right-4 text-8xl opacity-[0.03] font-display font-bold pointer-events-none">
        R
      </div>
    </div>
  );
}