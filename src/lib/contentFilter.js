/**
 * お笑い・漫才関連コンテンツ判定フィルター
 */

const COMEDY_KEYWORDS = ['漫才', 'M-1', 'お笑い', 'コント', 'お笑い芸人', 'グランプリ'];
const COMEDY_CATEGORY_IDS = ['23', '24']; // 23: コメディー, 24: エンターテイメント

export function isComedyContent(videoData) {
  const { title, description, tags, categoryId } = videoData;

  // カテゴリIDチェック
  if (COMEDY_CATEGORY_IDS.includes(String(categoryId))) {
    return true;
  }

  // キーワードチェック対象テキストを結合
  const searchTargets = [
    title || '',
    description || '',
    ...(Array.isArray(tags) ? tags : []),
  ].join(' ');

  return COMEDY_KEYWORDS.some((kw) => searchTargets.includes(kw));
}