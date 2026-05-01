import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VideoInput from './../components/diagnostic/VideoInput';
import DiagnosticResult from './../components/diagnostic/DiagnosticResult';
import { extractVideoId, fetchVideoStats } from './../lib/youtubeApi';
import { calculateCVR, determineRank } from './../lib/rankingEngine';
import { generateAnalysis } from './../lib/analysisGenerator';
import { isComedyContent } from './../lib/contentFilter';

export default function Diagnostic() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notComedy, setNotComedy] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (url) => {
    setError(null);
    setResult(null);
    setNotComedy(false);
    setIsLoading(true);

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('有効なYouTube URLを入力してください。');
      setIsLoading(false);
      return;
    }

    try {
      const videoData = await fetchVideoStats(videoId);

      if (!isComedyContent(videoData)) {
        setNotComedy(true);
        return;
      }

      const cvr = calculateCVR(videoData.likeCount, videoData.viewCount);
      const rank = determineRank(videoData.viewCount, cvr);
      const analysis = generateAnalysis(videoData, cvr, rank);

      setResult({ videoData, cvr, rank, analysis });
    } catch (err) {
      setError('サーバーとの通信に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 mb-6">
            <span className="text-2xl font-display font-bold text-primary">R</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif-jp font-bold text-foreground tracking-wider mb-3">
            <span className="text-primary">Ratiorma</span>
          </h1>
          <p className="text-xs md:text-sm font-display text-muted-foreground tracking-[0.3em] italic mb-2">
            ENGAGEMENT CVR DIAGNOSTICS
          </p>
          <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent mt-4 mb-6" />
          <p className="text-sm font-serif-jp text-muted-foreground/70 max-w-md mx-auto leading-relaxed">
            YouTube動画のエンゲージメントCVRを独自のM-1相対評価アルゴリズムで診断し、戦略的分析レポートを生成します。
          </p>
        </motion.div>

        <div className="mb-10">
          <VideoInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <p className="text-sm font-serif-jp text-primary tracking-wide">
              {error}
            </p>
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex flex-col items-center gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-transparent border-t-primary rounded-full animate-spin" />
              </div>
              <p className="text-sm font-serif-jp text-muted-foreground tracking-wider">
                データを取得中...
              </p>
            </div>
          </motion.div>
        )}

        {notComedy && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-10"
          >
            <div className="relative inline-flex flex-col items-center">
              <div className="absolute -inset-px bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-2xl blur-sm" />
              <div className="relative bg-card border border-primary/25 rounded-2xl px-8 py-8 max-w-lg">
                <div className="text-3xl mb-4">🎭</div>
                <p className="text-sm md:text-base font-serif-jp text-primary leading-relaxed tracking-wide">
                  対象外のコンテンツです。こちらの動画は漫才・お笑い関連動画として認識できませんでした。解析ロジック保護のため、M-1等の漫才動画のURLを入力してください。
                </p>
                <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mt-5" />
                <p className="text-xs font-display text-muted-foreground/50 italic tracking-widest mt-3">
                  Comedy Content Only
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {result && !isLoading && (
          <DiagnosticResult
            videoData={result.videoData}
            cvr={result.cvr}
            rank={result.rank}
            analysis={result.analysis}
          />
        )}
      </div>
    </div>
  );
}
