import React, { useState } from 'react';
import { extractVideoId, fetchVideoStats } from '../lib/youtubeApi';

// Base44の優れた相対評価ロジックを完全再現
const getDiagnosticResult = (viewCount, cvrStr) => {
  const cvr = parseFloat(cvrStr);
  
  if (viewCount >= 1000000) {
    if (cvr >= 1.5) return { icon: '👑', rank: 'ユニコーン企業', sub: 'Unicorn / M-1決勝レベル', label: 'メガヒット領域（100万再生超）', text: `${(viewCount/10000).toFixed(0)}万再生の到達圏において、CVR ${cvr}%は驚異的な熱狂度。マジョリティへの浸透とコア層の獲得を両立した稀有な資産である。` };
    if (cvr >= 0.8) return { icon: '💎', rank: '優良銘柄', sub: 'Blue Chip / M-1準決勝レベル', label: 'メガヒット領域（100万再生超）', text: `${(viewCount/10000).toFixed(0)}万再生の到達圏において、CVR ${cvr}%は安定的かつ優良な水準を示している。視聴者の共感と信頼が継続的に蓄積されており、優良銘柄としての堅実な成長ポテンシャルを備える。コンテンツの本質的な価値が市場に正しく評価されている証左である。` };
    return { icon: '⚠️', rank: '要テコ入れ', sub: 'Need Restructuring / M-1準々決勝レベル', label: 'メガヒット領域（100万再生超）', text: '再生数はメガヒット領域にあるが、能動的なアクション率がやや低い。幅広い層にリーチしている分、コアファンへの転換導線（フック）の強化が求められる。' };
  } 
  
  if (viewCount >= 100000) {
    if (cvr >= 3.0) return { icon: '👑', rank: 'ユニコーン企業', sub: 'Unicorn / M-1決勝レベル', label: 'ミドルヒット領域（10万再生超）', text: '10万再生を超えながらこの高CVRを維持している点は高く評価できる。刺さる層に極めて深く刺さっており、大化けするポテンシャルを秘めている。' };
    if (cvr >= 0.9) return { icon: '💎', rank: '優良銘柄', sub: 'Blue Chip / M-1準決勝レベル', label: 'ミドルヒット領域（10万再生超）', text: '再生数とエンゲージメントのバランスが取れた堅実な優良銘柄。ここからさらに上位層へ抜け出すための「爆発力」が次の課題となる。' };
    return { icon: '📉', rank: '不良債権', sub: 'Non-Performing Loan / M-1 2〜3回戦レベル', label: 'ミドルヒット領域（10万再生超）', text: '一定の露出は獲得しているが、視聴者の心を動かす決定打に欠ける。「見られる」から「評価される」フェーズへの移行が必要。' };
  }

  // 10万再生未満
  if (cvr >= 5.0) return { icon: '🔥', rank: '超優良ベンチャー', sub: 'High-Growth Startup / M-1準決勝レベル', label: 'アーリーステージ（10万再生未満）', text: '再生数こそ発展途上だが、触れた視聴者を虜にする異常な引力を持つ。適切なマーケティングで一気に跳ねるダイヤの原石。' };
  if (cvr >= 1.5) return { icon: '🌱', rank: '損益分岐点到達', sub: 'Break-Even / M-1 3回戦レベル', label: 'アーリーステージ（10万再生未満）', text: '標準以上のエンゲージメントを獲得しており、基礎的な実力は証明されている。他との明確な差別化（USP）が今後の鍵。' };
  return { icon: '📉', rank: '不良債権', sub: 'Non-Performing Loan / M-1 1回戦敗退レベル', label: 'アーリーステージ（10万再生未満）', text: '現時点では市場からの能動的な評価を得られていない。ターゲット層とネタのコンセプトの根本的な再定義が急務。' };
};

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
      // Base44の正確なロジック：高評価のみをエンゲージメントとする
      const cvr = stats.viewCount > 0 ? ((stats.likeCount / stats.viewCount) * 100).toFixed(3) : 0;
      const diagnosis = getDiagnosticResult(stats.viewCount, cvr);
      setResult({ ...stats, cvr, diagnosis });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // X（旧Twitter）へのシェア用URL生成
  const shareToX = () => {
    if (!result) return;
    const text = encodeURIComponent(
      `あなたの漫才のエンゲージメントCVRは ${result.cvr}%（${result.diagnosis.rank}）でした。\n\n【Ratiorma 戦略分析】\n${result.diagnosis.sub}\n\n#Ratiorma漫才解析`
    );
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-serif p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-12 mt-8">
        
        {/* ヘッダー */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-[#d4af37] tracking-widest font-sans">
            Ratiorma
          </h1>
          <p className="text-gray-400 tracking-[0.2em] text-sm font-sans uppercase">
            Engagement CVR Diagnostics
          </p>
          <p className="text-gray-500 text-xs mt-4 max-w-lg mx-auto">
            YouTube動画のエンゲージメントCVRを独自のM-1相対評価アルゴリズムで診断し、戦略的分析レポートを生成します。
          </p>
        </div>

        {/* 入力エリア */}
        <div className="bg-[#141414] p-3 rounded-xl border border-gray-800 shadow-lg flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="YouTube URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-3 text-white font-sans focus:outline-none focus:border-[#d4af37] transition-colors"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-[#d4af37] text-black px-8 py-3 rounded-lg font-bold hover:bg-[#ebd488] disabled:opacity-50 transition-colors whitespace-nowrap font-sans flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            {loading ? '分析中...' : '診断開始'}
          </button>
        </div>
        {error && <p className="text-red-400 text-center font-bold text-sm">{error}</p>}

        {/* 診断結果エリア（Base44デザイン完全踏襲） */}
        {result && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center">
              <p className="text-[#d4af37] tracking-[0.3em] text-xs uppercase font-sans mb-6">Diagnostic Report</p>
            </div>

            {/* 動画情報（サムネイル追加） */}
            <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
              <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                <img src={result.thumbnail} alt={result.title} className="w-full h-auto object-cover" />
              </div>
              <div className="w-full md:w-1/2 space-y-3">
                <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">{result.title}</h2>
                <div className="text-gray-400 text-sm space-y-1 font-sans">
                  <p>Ratiorma Analysis Engine</p>
                  <p>データ取得完了</p>
                </div>
              </div>
            </div>

            {/* ランクバッジ */}
            <div className="flex justify-center mb-8 relative">
              <div className="bg-[#121629] border border-[#2a3b75] px-16 py-8 rounded-2xl text-center shadow-[0_0_30px_rgba(42,59,117,0.3)] z-10">
                <div className="text-4xl mb-2">{result.diagnosis.icon}</div>
                <h3 className="text-3xl md:text-4xl font-bold text-blue-200 tracking-wider mb-2">
                  【{result.diagnosis.rank}】
                </h3>
                <p className="text-gray-400 text-sm tracking-widest font-sans italic">
                  {result.diagnosis.sub}
                </p>
              </div>
            </div>

            <div className="text-center mb-6">
              <span className="bg-[#1f1f1f] border border-[#d4af37]/30 text-[#d4af37] px-6 py-2 rounded-full text-xs tracking-widest">
                {result.diagnosis.label}
              </span>
            </div>

            {/* 数値データ4連 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#141414] border border-gray-800 p-5 rounded-xl text-center">
                <p className="text-gray-500 text-xs tracking-widest mb-3 font-sans">👁 確定再生回数</p>
                <p className="text-2xl font-bold text-white font-sans">{result.viewCount.toLocaleString()}<span className="text-xs text-gray-500 ml-1 font-serif">回</span></p>
              </div>
              <div className="bg-[#141414] border border-gray-800 p-5 rounded-xl text-center">
                <p className="text-gray-500 text-xs tracking-widest mb-3 font-sans">♡ いいね数</p>
                <p className="text-2xl font-bold text-white font-sans">{result.likeCount.toLocaleString()}<span className="text-xs text-gray-500 ml-1 font-serif">件</span></p>
              </div>
              <div className="bg-[#141414] border border-gray-800 p-5 rounded-xl text-center shadow-[0_0_15px_rgba(212,175,55,0.1)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#d4af37]"></div>
                <p className="text-gray-300 text-xs tracking-widest mb-3 font-sans">↗ エンゲージメント CVR</p>
                <p className="text-3xl font-bold text-white font-sans">{result.cvr}<span className="text-sm text-gray-500 ml-1 font-serif">%</span></p>
              </div>
              <div className="bg-[#141414] border border-gray-800 p-5 rounded-xl text-center">
                <p className="text-gray-500 text-xs tracking-widest mb-3 font-sans">💬 コメント数</p>
                <p className="text-2xl font-bold text-white font-sans">{result.commentCount.toLocaleString()}<span className="text-xs text-gray-500 ml-1 font-serif">件</span></p>
              </div>
            </div>

            {/* 戦略分析レポート */}
            <div className="bg-[#141414] border border-[#d4af37]/30 p-8 rounded-xl mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#d4af37]/20 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white tracking-widest">ラティオルマ・戦略分析</h4>
                  <p className="text-gray-500 text-xs font-sans italic">Ratiorma Strategic Analysis</p>
                </div>
              </div>
              <p className="text-gray-300 leading-loose text-sm md:text-base tracking-wide">
                {result.diagnosis.text}
              </p>
            </div>

            {/* X（旧Twitter）シェアボタン */}
            <div className="flex justify-center pt-6 pb-4">
              <button
                onClick={shareToX}
                className="group relative flex items-center gap-3 bg-[#141414] border border-[#d4af37]/40 px-8 py-4 rounded-full overflow-hidden hover:border-[#d4af37] transition-all shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                <svg className="w-5 h-5 fill-white relative z-10" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-[#d4af37] font-bold tracking-wider relative z-10 text-sm font-sans">
                  診断結果をポストする
                </span>
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
