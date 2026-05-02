import React, { useState } from 'react';
import { extractVideoId, fetchVideoStats } from '../lib/youtubeApi';

export default function Diagnostic() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setError('');
    setResult(null);
    if (!url) {
      setError('YouTubeのURLを入力してください。');
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('正しいYouTubeのURLを入力してください。');
      return;
    }

    setLoading(true);
    try {
      const stats = await fetchVideoStats(videoId);
      const engagement = stats.likeCount + stats.commentCount;
      const cvr = stats.viewCount > 0 ? ((engagement / stats.viewCount) * 100).toFixed(2) : 0;
      setResult({ ...stats, cvr });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-8 mt-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-[#d4af37] tracking-widest">Ratiorma</h1>
          <p className="text-gray-400 tracking-wider">M-1 Engagement CVR Diagnostics</p>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#d4af37]/30 shadow-2xl shadow-[#d4af37]/10">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="分析したいYouTube URLを入力..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-[#d4af37] text-black px-8 py-3 rounded-lg font-bold hover:bg-[#f3c13a] disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {loading ? '分析中...' : '診断開始'}
            </button>
          </div>
          {error && <p className="text-red-400 mt-4 text-sm font-bold">{error}</p>}
        </div>

        {result && (
          <div className="bg-[#1a1a1a] rounded-xl border border-[#d4af37]/30 overflow-hidden mt-8">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6 text-white border-b border-gray-800 pb-4">{result.title}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#2a2a2a] p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm mb-1">再生回数</p>
                  <p className="text-2xl font-bold text-white">{result.viewCount.toLocaleString()}</p>
                </div>
                <div className="bg-[#2a2a2a] p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm mb-1">高評価</p>
                  <p className="text-2xl font-bold text-white">{result.likeCount.toLocaleString()}</p>
                </div>
                <div className="bg-[#2a2a2a] p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm mb-1">コメント</p>
                  <p className="text-2xl font-bold text-white">{result.commentCount.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-[#d4af37] to-[#b8952d] p-4 rounded-lg text-center shadow-lg transform hover:scale-105 transition-transform">
                  <p className="text-black/80 text-sm mb-1 font-bold">エンゲージメントCVR</p>
                  <p className="text-3xl font-black text-black">{result.cvr}%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
