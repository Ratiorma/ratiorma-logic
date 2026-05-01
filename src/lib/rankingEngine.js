/**
 * M-1 Relative Evaluation Algorithm
 * Determines rank based on view count tier and CVR percentage
 */

const RANKS = {
  UNICORN: {
    label: '【ユニコーン企業】',
    subtitle: 'Unicorn / M-1決勝レベル',
    tier: 'unicorn',
    color: 'gold',
  },
  BLUE_CHIP: {
    label: '【優良銘柄】',
    subtitle: 'Blue Chip / M-1準決勝レベル',
    tier: 'bluechip',
    color: 'gold',
  },
  GROWTH: {
    label: '【成長株】',
    subtitle: 'Growth Stock / M-1準々決勝レベル',
    tier: 'growth',
    color: 'silver',
  },
  STANDARD: {
    label: '【安定運用】',
    subtitle: 'Standard / M-1・2回戦レベル',
    tier: 'standard',
    color: 'silver',
  },
  NON_PERFORMING: {
    label: '【不良債権】',
    subtitle: 'Non-Performing Loan / M-1・1回戦敗退レベル',
    tier: 'nonperforming',
    color: 'rose',
  },
};

export function calculateCVR(likeCount, viewCount) {
  if (viewCount === 0) return 0;
  return (likeCount / viewCount) * 100;
}

export function determineRank(viewCount, cvr) {
  // Tier 1: 100万回以上
  if (viewCount >= 1_000_000) {
    if (cvr >= 1.0) return RANKS.UNICORN;
    if (cvr >= 0.5) return RANKS.BLUE_CHIP;
    if (cvr >= 0.3) return RANKS.GROWTH;
    if (cvr >= 0.15) return RANKS.STANDARD;
    return RANKS.NON_PERFORMING;
  }

  // Tier 2: 10万回以上 〜 100万回未満
  if (viewCount >= 100_000) {
    if (cvr >= 3.0) return RANKS.UNICORN;
    if (cvr >= 2.0) return RANKS.BLUE_CHIP;
    if (cvr >= 1.2) return RANKS.GROWTH;
    if (cvr >= 0.8) return RANKS.STANDARD;
    return RANKS.NON_PERFORMING;
  }

  // Tier 3: 1万回以上 〜 10万回未満
  if (viewCount >= 10_000) {
    if (cvr >= 5.0) return RANKS.UNICORN;
    if (cvr >= 3.5) return RANKS.BLUE_CHIP;
    if (cvr >= 2.0) return RANKS.GROWTH;
    if (cvr >= 1.0) return RANKS.STANDARD;
    return RANKS.NON_PERFORMING;
  }

  // Tier 4: 1,000回以上 〜 1万回未満
  if (viewCount >= 1_000) {
    if (cvr >= 7.0) return RANKS.UNICORN;
    if (cvr >= 5.0) return RANKS.BLUE_CHIP;
    if (cvr >= 3.0) return RANKS.GROWTH;
    if (cvr >= 1.5) return RANKS.STANDARD;
    return RANKS.NON_PERFORMING;
  }

  // Tier 5: 1,000回未満
  if (cvr >= 10.0) return RANKS.UNICORN;
  if (cvr >= 7.0) return RANKS.BLUE_CHIP;
  if (cvr >= 4.0) return RANKS.GROWTH;
  if (cvr >= 2.0) return RANKS.STANDARD;
  return RANKS.NON_PERFORMING;
}

export function formatNumber(num) {
  return num.toLocaleString('ja-JP');
}

export function getViewTierLabel(viewCount) {
  if (viewCount >= 1_000_000) return 'メガヒット領域（100万再生超）';
  if (viewCount >= 100_000) return 'バイラル領域（10万再生超）';
  if (viewCount >= 10_000) return '拡散領域（1万再生超）';
  if (viewCount >= 1_000) return '成長領域（1,000再生超）';
  return '初動領域（1,000再生未満）';
}