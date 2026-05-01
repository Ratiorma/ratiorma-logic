const API_KEY = 'AIzaSyDAQEdcQfSbmTo28VBithf80XjfgaSK7eM';

/**
 * Extract video ID from various YouTube URL formats
 */
export function extractVideoId(url) {
  if (!url) return null;
  const trimmed = url.trim();

  // Direct video ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const patterns = [
    // Standard: youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
    // Short: youtu.be/VIDEO_ID
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // Embed: youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // Shorts: youtube.com/shorts/VIDEO_ID
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    // Live: youtube.com/live/VIDEO_ID
    /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    // v= anywhere
    /[?&]v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * Fetch video statistics from YouTube Data API v3
 */
export async function fetchVideoStats(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${API_KEY}`;

  const response = await fetch(url, {
    cache: 'no-cache',
    headers: { 'Cache-Control': 'no-cache' },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    throw new Error('動画が見つかりませんでした');
  }

  const item = data.items[0];
  const stats = item.statistics;
  const snippet = item.snippet;

  return {
    title: snippet.title,
    channelTitle: snippet.channelTitle,
    publishedAt: snippet.publishedAt,
    thumbnailUrl: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url,
    description: snippet.description || '',
    tags: snippet.tags || [],
    categoryId: snippet.categoryId || '',
    viewCount: parseInt(stats.viewCount, 10) || 0,
    likeCount: parseInt(stats.likeCount, 10) || 0,
    commentCount: parseInt(stats.commentCount, 10) || 0,
  };
}