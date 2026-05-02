import React, { useState } from 'react';
import { extractVideoId, fetchVideoStats } from '../lib/youtubeApi';

// Ratiorma独自の相対評価ロジック（実際のM-1決勝データを反映した極限チューニング）
const getDiagnosticResult = (viewCount, cvrStr) => {
  const cvr = parseFloat(cvrStr);
  
  if (viewCount >= 1000000) {
    // メガヒット領域（100万再生超）
    // 100万回を超えて0.8%以上なら文句なしのトップオブトップ（決勝）
    if (cvr >= 0.8) return { icon: '👑', rank: 'ユニコーン企業', sub: 'Unicorn / M-1決勝レベル', label: 'メガヒット領域（100万再生超）', text: `圧倒的なマスへの到達（${(viewCount/10000).toFixed(0)}万再生）を達成しながら、CVR ${cvr}%という驚異的なエンゲージメントを維持している稀有な事例である。一般層への「ウケ」と、お笑いフリークを唸らせる「ネタの強度」が完全に同居しており、M-1決勝の舞台において審査員と観客の双方を掌握できる完全無欠のポテンシャルを誇る。もはや単なるネタ動画の枠を超え、強固なブランドとして市場に君臨するメガ・ユニコーン銘柄である。` };
    if (cvr >= 0.4) return { icon: '💎', rank: '優良事業', sub: 'Cash Cow / M-1・準々決勝～準決勝レベル', label: 'メガヒット領域（100万再生超）', text: `${(viewCount/10000).toFixed(0)}万再生という巨大な分母に対し、CVR ${cvr}%は非常に安定的かつ優秀なスコアである。一過性のバズ消費に終わらず、視聴者が確実にネタの本質的価値を評価し、強固な支持基盤（キャッシュカウ）を形成している。賞レースの過酷な予選を突破する地力はすでに証明済みであり、決勝進出に向けては「この組ならではの爆発的フック」を一点突破で研ぎ澄ますフェーズに入っている。` };
    if (cvr >= 0.15) return { icon: '🌱', rank: '損益分岐点', sub: 'Break-Even Point / M-1・2回戦・3回戦レベル', label: 'メガヒット領域（100万再生超）', text: `メガヒット領域に到達し、マジョリティ層への認知拡大には成功しているものの、能動的な評価（高評価率）は市場の平均値に収束している。YouTubeのアルゴリズムによる露出恩恵を多分に受けている可能性が高く、視聴者が「コアなファン」へ転換する手前の段階（損益分岐点）に留まっている。今後は、広く見られることよりも「深く刺さる」ための、ネタの根幹となるUSP（独自の強み）の再定義が求められる。` };
    return { icon: '📉', rank: '不良債権', sub: 'Non-Performing Loan / M-1・1回戦敗退レベル', label: 'メガヒット領域（100万再生超）', text: `莫大なインプレッションを獲得しているにも関わらず、CVR ${cvr}%という数値は、ターゲット層との深刻なミスマッチを示唆している。サムネイルやタイトルによる一時的な誘引には成功しているが、コンテンツの実態が視聴者の期待値に応えられていない。現状のままでは賞レースでの評価獲得は極めて困難であり、小手先の修正ではなく、漫才のシステムそのものに対する抜本的な構造改革（リストラクチャリング）が急務である。` };
  } 
  
  if (viewCount >= 100000) {
    // ミドルヒット領域（10万再生超〜99万再生）
    // ★ 1.0% を超えれば決勝レベル（ユニコーン）として正しく評価
    if (cvr >= 1.0) return { icon: '👑', rank: 'ユニコーン企業', sub: 'Unicorn / M-1決勝レベル', label: 'ミドルヒット領域（10万再生超）', text: `数十万規模のリーチを持ちながら、CVR ${cvr}%という圧倒的なアウトライアー（異常値）を叩き出している。これはマスに届きつつも、特定のお笑いコア層に「深く、そして鋭く」突き刺さっている確たる証拠である。この異常な熱量を保ったまま賞レースを駆け上がれば、一気に業界の勢力図を塗り替える「ユニコーン（大化け銘柄）」となる完全無欠のポテンシャルを秘めている。` };
    if (cvr >= 0.5) return { icon: '💎', rank: '優良事業', sub: 'Cash Cow / M-1・準々決勝～準決勝レベル', label: 'ミドルヒット領域（10万再生超）', text: `再生数とエンゲージメントのバランスが美しく最適化された、極めて健全な優良事業モデルである。視聴者の信頼が継続的に蓄積されており、M-1においても準々決勝・準決勝と堅実に駒を進める「負けない戦い」ができる実力を持つ。さらなる飛躍、すなわち決勝の舞台を掴み取るためには、既存の枠組みをあえて破壊するような「予測不能な裏切り」のスパイスが必要となる。` };
    if (cvr >= 0.2) return { icon: '🌱', rank: '損益分岐点', sub: 'Break-Even Point / M-1・2回戦・3回戦レベル', label: 'ミドルヒット領域（10万再生超）', text: `標準的なエンゲージメント水準を確保しており、基礎的な技術力と構成力は市場に証明されている。しかし、数多いる実力派漫才師の中で「なぜ彼らでなければならないのか」という絶対的な理由付けに欠けている。現状の損益分岐点から抜け出すためには、キャラクターの深掘りや、他組には真似できない唯一無二のストロングポイントの確立にリソースを集中投下すべきである。` };
    return { icon: '📉', rank: '不良債権', sub: 'Non-Performing Loan / M-1・1回戦敗退レベル', label: 'ミドルヒット領域（10万再生超）', text: `一定の認知は得られているものの、視聴者の心を揺さぶる決定打が不足している。「とりあえず見られる」という状態から、「思わず評価ボタンを押したくなる」という能動的なフェーズへの移行デザインが欠落している。ターゲットが誰なのかが曖昧になっている可能性が高く、ペルソナの再設定と、ネタの冒頭15秒における強烈なフックの再開発が必須である。` };
  }

  // アーリーステージ（10万再生未満）
  if (cvr >= 3.0) return { icon: '👑', rank: 'ユニコーン企業', sub: 'Unicorn / M-1決勝レベル', label: 'アーリーステージ（10万再生未満）', text: `分母となる再生数こそ発展途上（アーリーステージ）であるが、一度触れた視聴者を確実に虜にするCVR ${cvr}%という数字は、もはや「暴力的なまでの引力」である。マス向けの最適化を一切無視した、純度の高いお笑いのコアがそこに存在する。この熱狂の種火を消すことなく、戦略的なSNS露出やライブでの実績構築を掛け合わせることで、瞬く間にスターダムへと駆け上がるSSR級の原石である。` };
  if (cvr >= 1.2) return { icon: '💎', rank: '優良事業', sub: 'Cash Cow / M-1・準々決勝～準決勝レベル', label: 'アーリーステージ（10万再生未満）', text: `初期段階のプロジェクトとしては、申し分のないエンゲージメント率を記録している。ニッチな層に深く突き刺さる「独自の世界観（コンセプチュアルな強み）」が正しく市場に評価され始めている段階だ。この確固たる支持基盤をキャッシュカウ（資金源）として足場を固めつつ、少しずつ一般層にも伝わる翻訳（チューニング）を施していくことが、次なる成長への最短ルートとなる。` };
  if (cvr >= 0.5) return { icon: '🌱', rank: '損益分岐点', sub: 'Break-Even Point / M-1・2回戦・3回戦レベル', label: 'アーリーステージ（10万再生未満）', text: `初期段階において標準以上のCVRを獲得しており、最低限の品質保証（クオリティ・アシュアランス）はクリアしている。しかし、爆発的なバズを生み出すための「起爆剤」がまだ投下されていない。漫才の後半に向けてのボルテージの上げ方や、記憶にこびりつく強烈なパンチラインの欠如が課題であり、構成のクライマックスにおけるカタルシスの最大化を図るべきである。` };
  return { icon: '📉', rank: '不良債権', sub: 'Non-Performing Loan / M-1・1回戦敗退レベル', label: 'アーリーステージ（10万再生未満）', text: `残念ながら、現時点では市場からの能動的な評価を全く得られておらず、コンセプトレベルでの深刻なエラーが起きている。現状のまま回数を重ねてもサンクコスト（埋没費用）が膨らむばかりである。客観的なフィードバックを徹底的に収集し、「自分たちがやりたいお笑い」と「市場が求めているお笑い」の乖離を冷静に分析・すり合わせるという、痛みを伴う改革が必要不可欠だ。` };
};

export default function Diagnostic() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    setError('');
    setResult(null);
    setCopied(false);
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
      const cvr = stats.viewCount > 0 ? ((stats.likeCount / stats.viewCount) * 100).toFixed(3) : 0;
      const diagnosis = getDiagnosticResult(stats.viewCount, cvr);
      setResult({ ...stats, cvr, diagnosis, videoUrl: url });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getShareText = () => {
    if (!result) return '';
    return `漫才のエンゲージメントCVRは ${result.cvr}%（${result.diagnosis.rank}）でした。\n\n【Ratiorma 戦略分析】\n${result.diagnosis.sub}\n\nURL: ${result.videoUrl}\n#Ratiorma漫才解析`;
  };

  const shareToX = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}`;
    window.open(shareUrl, '_blank');
  };

  const shareToLine = () => {
    const shareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(getShareText())}`;
    window.open(shareUrl, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap');
          
          .font-elegant {
            font-family: 'Playfair Display', 'Noto Serif JP', serif;
          }
          .font-numbers {
            font-family: 'Playfair Display', serif;
            font-variant-numeric: lining-nums proportional-nums;
          }
        `}
      </style>

      <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-elegant p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-12 mt-8">
          
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-6 animate-fade-in-up">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl border border-[#d4af37]/30 shadow-[0_0_20px_rgba(212,175,55,0.1)] flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#d4af37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="text-[#d4af37] text-2xl md:text-3xl font-bold tracking-widest relative z-10 drop-shadow-md">
                  R
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[#d4af37] tracking-widest">
              Ratiorma
            </h1>
            <p className="text-gray-400 tracking-[0.2em] text-xs md:text-sm uppercase italic mt-2">
              Engagement CVR Diagnostics
            </p>
            
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent mx-auto mt-6 mb-4"></div>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              YouTube動画のエンゲージメントCVRを独自のM-1相対評価アルゴリズムで診断し、戦略的分析レポートを生成します。
            </p>
          </div>

          <div className="bg-[#141414] p-3 rounded-xl border border-gray-800 shadow-lg flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Youtube漫才動画のURLを入れて下さい。"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-3 text-white font-sans focus:outline-none focus:border-[#d4af37] transition-colors"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-[#d4af37] text-black px-8 py-3 rounded-lg font-bold hover:bg-[#ebd488] disabled:opacity-50 transition-colors whitespace-nowrap flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              {loading ? '分析中...' : '診断開始'}
            </button>
          </div>
          {error && <p className="text-red-400 text-center font-bold text-sm">{error}</p>}

          {result && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="text-center">
                <p className="text-[#d4af37] tracking-[0.3em] text-xs uppercase mb-6">Diagnostic Report</p>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
                <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                  <img src={result.thumbnail} alt={result.title} className="w-full h-auto object-cover" />
                </div>
                <div className="w-full md:w-1/2 space-y-3">
                  <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">{result.title}</h2>
                  <div className="text-gray-400 text-sm space-y-1">
                    <p>Ratiorma Analysis Engine</p>
                    <p>データ取得完了</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mb-8 relative">
                <div className="bg-[#121629] border border-[#2a3b75] px-16 py-8 rounded-2xl text-center shadow-[0_0_30px_rgba(42,59,117,0.3)] z-10">
                  <div className="text-4xl mb-2">{result.diagnosis.icon}</div>
                  <h3 className="text-3xl md:text-4xl font-bold text-blue-200 tracking-wider mb-2">
                    【{result.diagnosis.rank}】
                  </h3>
                  <p className="text-gray-400 text-sm tracking-widest italic">
                    {result.diagnosis.sub}
                  </p>
                </div>
              </div>

              <div className="text-center mb-6">
                <span className="bg-[#1f1f1f] border border-[#d4af37]/30 text-[#d4af37] px-6 py-2 rounded-full text-xs tracking-widest">
                  {result.diagnosis.label}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#141414] border border-gray-800 p-5 rounded-xl text-center hover:border-gray-600 transition-colors">
                  <p className="text-gray-500 text-xs tracking-widest mb-3">👁 確定再生回数</p>
                  <p className="text-2xl md:text-3xl font-bold text-white font-numbers">{result.viewCount.toLocaleString()}<span className="text-xs text-gray-500 ml-1">回</span></p>
                </div>
                <div className="bg-[#141414] border border-gray-800 p-5 rounded-xl text-center hover:border-gray-600 transition-colors">
                  <p className="text-gray-500 text-xs tracking-widest mb-3">♡ いいね数</p>
                  <p className="text-2xl md:text-3xl font-bold text-white font-numbers">{result.likeCount.toLocaleString()}<span className="text-xs text-gray-500 ml-1">件</span></p>
                </div>
                <div className="bg-[#141414] border border-gray-800 p-5 rounded-xl text-center shadow-[0_0_15px_rgba(212,175,55,0.1)] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#d4af37]"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <p className="text-[#d4af37] text-xs font-bold tracking-widest mb-3">↗ エンゲージメント CVR</p>
                  <p className="text-3xl md:text-4xl font-bold text-white font-numbers">{result.cvr}<span className="text-sm text-gray-500 ml-1">%</span></p>
                </div>
                <div className="bg-[#141414] border border-gray-800 p-5 rounded-xl text-center hover:border-gray-600 transition-colors">
                  <p className="text-gray-500 text-xs tracking-widest mb-3">💬 コメント数</p>
                  <p className="text-2xl md:text-3xl font-bold text-white font-numbers">{result.commentCount.toLocaleString()}<span className="text-xs text-gray-500 ml-1">件</span></p>
                </div>
              </div>

              <div className="bg-[#141414] border border-[#d4af37]/30 p-8 rounded-xl mt-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#d4af37]/10 p-2 rounded-lg border border-[#d4af37]/20">
                    <svg className="w-5 h-5 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white tracking-widest">ラティオルマ・戦略分析</h4>
                    <p className="text-gray-500 text-xs italic">Ratiorma Strategic Analysis</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-loose text-sm md:text-base tracking-wide whitespace-pre-wrap">
                  {result.diagnosis.text}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 pt-6 pb-4">
                <button
                  onClick={shareToX}
                  className="flex items-center gap-2 bg-[#141414] border border-gray-700 px-6 py-3 rounded-full hover:border-[#d4af37] hover:text-[#d4af37] transition-all text-gray-300 text-sm tracking-wider"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  ポスト
                </button>

                <button
                  onClick={shareToLine}
                  className="flex items-center gap-2 bg-[#141414] border border-[#06C755]/40 px-6 py-3 rounded-full hover:border-[#06C755] hover:bg-[#06C755]/5 transition-all text-[#06C755] text-sm tracking-wider"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                     <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.96 8.904 9.404 9.608.371.077.868.238 1.002.544.122.28-.04.856-.123 1.205-.098.411-.476 1.884-.578 2.296-.134.542.612.87 1.05.589.626-.4 3.393-2.128 4.654-3.14 3.256-2.618 5.591-5.698 5.591-8.798" />
                  </svg>
                  LINEで送る
                </button>

                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 bg-[#141414] border px-6 py-3 rounded-full transition-all text-sm tracking-wider ${copied ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10' : 'border-gray-700 text-gray-300 hover:border-gray-400'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  {copied ? 'コピーしました！' : 'テキストをコピー'}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}
