import React, { useState } from 'react';
import { extractVideoId, fetchVideoStats } from '../lib/youtubeApi';

// Ratiorma流・相対的M-1評価アルゴリズム
const getDiagnosticResult = (viewCount, cvrStr) => {
  const cvr = parseFloat(cvrStr);
  let rank, subtitle, analysis, gradient;

  if (viewCount >= 1000000) {
    if (cvr >= 1.0) {
      rank = 'ユニコーン企業';
      subtitle = 'Unicorn / M-1決勝レベル';
      analysis = `${(viewCount / 10000).toFixed(0)}万再生というマジョリティへの圧倒的な浸透と、1%超えの熱狂を両立した稀有な資産です。大衆性とコアファンの熱量を併せ持ち、M-1決勝の舞台でも確実に観客を巻き込める「覇権」のポテンシャルを秘めています。`;
      gradient = 'from-[#d4af37] via-[#e6a8d7] to-[#d4af37]'; // ゴールド×ローズピンク
    } else {
      rank = '不良債権';
      subtitle = 'Non-Performing Loan / M-1・1回戦敗退レベル';
      analysis = '再生数はメガヒット領域に達していますが、能動的なエンゲージメント（高評価）が伴っていません。アルゴリズムによる偶発的な露出が多く、コアファンの形成に至っていないため、ネタの本質的な「フック（掴み）」の再設計が急務です。';
      gradient = 'from-gray-600 to-gray-800';
    }
  } else if (viewCount >= 100000) {
    if (cvr >= 3.0) {
      rank = 'ユニコーン企業';
      subtitle = 'Unicorn / M-1決勝レベル';
      analysis = '10万再生を超える広範なリーチを持ちながら、この驚異的なCVRを維持しているのは「刺さる層に極めて深く刺さっている」証拠です。この独自の熱狂を保ったままリーチを拡大できれば、一気に業界を席巻する大化け銘柄となります。';
      gradient = 'from-[#d4af37] via-[#e6a8d7] to-[#d4af37]';
    } else if (cvr >= 0.8) {
      rank = '優良事業';
      subtitle = 'Cash Cow / M-1・準々決勝～準決勝レベル';
      analysis = '再生数とエンゲージメントのバランスが美しく取れた堅実な優良銘柄です。視聴者の信頼が継続的に蓄積されており、賞レースでも確実に結果を残す地力があります。さらなる飛躍には、初見の観客を惹きつける「爆発力」のスパイスが必要です。';
      gradient = 'from-[#d4af37] to-[#b8952d]';
    } else {
      rank = '不良債権';
      subtitle = 'Non-Performing Loan / M-1・1回戦敗退レベル';
      analysis = '一定の再生数は獲得していますが、視聴者の心を動かす決定打に欠けている状態です。「見られる」から「深く評価される」フェーズへ移行するための、ターゲット層の見直しと戦略的テコ入れが推奨されます。';
      gradient = 'from-gray-600 to-gray-800';
    }
  } else {
    // 10万再生未満（アーリーステージ）
    if (cvr >= 5.0) {
      rank = 'ユニコーン企業';
      subtitle = 'Unicorn / M-1決勝レベル';
      analysis = '再生数こそ発展途上ですが、触れた視聴者を確実に虜にする異常なまでの引力（CVR 5%超）を持っています。このコアな熱狂を種火として、適切な露出マーケティングを行えば、爆発的な成長を見せるダイヤの原石です。';
      gradient = 'from-[#d4af37] via-[#e6a8d7] to-[#d4af37]';
    } else if (cvr >= 3.0) {
      rank = '優良事業';
      subtitle = 'Cash Cow / M-1・準々決勝～準決勝レベル';
      analysis = '高いエンゲージメント率を誇り、特定のターゲットへの訴求力は申し分ありません。ニッチな層に深く突き刺さる「独自の世界観」が正しく評価されている証左です。';
      gradient = 'from-[#d4af37] to-[#b8952d]';
    } else if (cvr >= 1.0) {
      rank = '損益分岐点';
      subtitle = 'Break-Even Point / M-1・2回戦・3回戦レベル';
      analysis = '標準的なエンゲージメントを獲得しており、基礎的な実力は市場に証明されています。ここから上位層へ抜け出すためには、他との明確な差別化（USP）と、ネタ後半の展開力が鍵となります。';
      gradient = 'from-[#b8c6db] to-[#f5f7fa] text-gray-800'; // シルバー系
    } else {
      rank = '不良債権';
      subtitle = 'Non-Performing Loan / M-1・1回戦敗退レベル';
      analysis = '現時点では市場からの能動的な評価を得られていない厳しい状態です。小手先の修正ではなく、誰に何を届けるのかという「コンセプト」の根本的な再定義が必要です。';
      gradient = 'from-gray-600 to-gray-800';
    }
  }

  return { rank, subtitle, analysis, gradient };
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
      // Ratiorma流：純粋な「高評価」のみをエンゲージメントとして抽出
      const cvr = stats.viewCount > 0 ? ((stats.likeCount / stats.viewCount) * 100).toFixed(2) : 0;
      
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
      `あなたの漫才のエンゲージメントCVRは ${result.cvr}%（${result.diagnosis.rank}）でした。\n\n【Ratiorma 戦略分析】\n${result.diagnosis.subtitle}\n\n#Ratiorma漫才解析`
    );
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 p-4 md:p-8 font-serif selection:bg-[#e6a8d7] selection:text-black">
      <div className="max-w-4xl mx-auto space-y-12 mt-8">
        
        {/* ヘッダーエリア */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] via-[#e6a8d7] to-[#d4af37] tracking-widest drop-shadow-lg">
            Ratiorma
          </h1>
          <p className="text-[#a8a8a8] tracking-[0.3em] text-sm md:text-base uppercase">
            M-1 Engagement CVR Diagnostics
          </p>
        </div>

        {/* 入力エリア */}
        <div className="bg-[#0f0f0f] p-2 rounded-2xl border border-[#d4af37]/20 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="YouTube URL（漫才・ネタ動画）をペースト..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-xl px-6 py-4 text-white font-sans focus:outline-none focus:border-[#e6a8d7]/50 transition-colors placeholder-gray-600"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-gradient-to-r from-[#d4af37] to-[#b8952d] text-black px-10 py-4 rounded-xl font-bold tracking-widest hover:opacity-90 disabled:opacity-50 transition-all whitespace-nowrap shadow-lg shadow-[#d4af37]/20"
            >
              {loading ? '分析中...' : '診断開始'}
            </button>
          </div>
        </div>
        {error && <p className="text-rose-400 text-center font-bold">{error}</p>}

        {/* 診断結果出力エリア */}
        {result && (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* ランク＆称号エリア（アイキャッチ） */}
            <div className={`p-10 rounded-2xl text-center bg-gradient-to-b ${result.diagnosis.gradient} shadow-2xl relative overflow-hidden group`}>
              {/* 装飾的な背景エフェクト */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
              
              <div className="relative z-10">
                <p className="text-sm font-bold tracking-[0.2em] text-white/80 mb-4 uppercase">
                  Diagnostic Result
                </p>
                <h2 className="text-5xl md:text-7xl font-black text-white mb-2 drop-shadow-md">
                  【{result.diagnosis.rank}】
                </h2>
                <p className="text-lg md:text-xl font-medium text-white/90 tracking-widest font-sans">
                  {result.diagnosis.subtitle}
                </p>
              </div>
            </div>

            {/* 数値データエリア */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-2xl text-center flex flex-col justify-center">
                <p className="text-gray-500 text-xs tracking-widest mb-2">確定再生回数</p>
                <p className="text-3xl font-bold font-sans text-gray-200">
                  {result.viewCount.toLocaleString()}<span className="text-sm text-gray-500 ml-1">回</span>
                </p>
              </div>
              <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-2xl text-center flex flex-col justify-center">
                <p className="text-gray-500 text-xs tracking-widest mb-2">高評価（エンゲージメント）</p>
                <p className="text-3xl font-bold font-sans text-gray-200">
                  {result.likeCount.toLocaleString()}<span className="text-sm text-gray-500 ml-1">件</span>
                </p>
              </div>
              <div className="bg-[#151515] border border-[#d4af37]/30 p-6 rounded-2xl text-center flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d4af37] to-[#e6a8d7]"></div>
                <p className="text-[#d4af37] text-xs font-bold tracking-widest mb-2">エンゲージメントCVR</p>
                <p className="text-4xl font-black font-sans text-white">
                  {result.cvr}<span className="text-xl text-[#d4af37] ml-1">%</span>
                </p>
              </div>
            </div>

            {/* 戦略分析レポート（コンサルタント視点） */}
            <div className="bg-[#0f0f0f] p-8 rounded-2xl border border-gray-800 relative">
              <div className="absolute -top-3 left-8 bg-[#050505] px-4">
                <span className="text-[#e6a8d7] text-sm font-bold tracking-widest">ラティオルマ・戦略分析</span>
              </div>
              <p className="text-gray-300 leading-loose text-base md:text-lg mt-4">
                {result.diagnosis.analysis}
              </p>
            </div>

            {/* シェアボタン群 */}
            <div className="flex justify-center pt-4">
              <button
                onClick={shareToX}
                className="group relative flex items-center gap-3 bg-black border border-[#d4af37]/50 px-8 py-4 rounded-full overflow-hidden hover:border-[#d4af37] transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/10 to-[#e6a8d7]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <svg className="w-5 h-5 fill-white relative z-10" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-white font-bold tracking-wider relative z-10 text-sm">
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
