// ↓ここに直接APIキーを貼り付けます
const API_KEY = 'あなたのAPIキーをここに貼り付けます';

export const extractVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const fetchVideoStats = async (videoId) => {
  // 強制的に直接書き込んだキーを使用します
  const keyToUse = import.meta.env?.VITE_YOUTUBE_API_KEY || API_KEY;

  if (!keyToUse || keyToUse === 'あなたのAPIキーをここに貼り付けます') {
    throw new Error('APIキーが正しく入力されていません。');
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${keyToUse}`
  );

  if (!response.ok) {
    throw new Error('YouTubeサーバーとの通信に失敗しました。');
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    throw new Error('動画が見つかりません。URLを確認してください。');
  }

  const video = data.items[0];
  return {
    title: video.snippet.title,
    thumbnail: video.snippet.thumbnails.high.url,
    viewCount: parseInt(video.statistics.viewCount || 0, 10),
    likeCount: parseInt(video.statistics.likeCount || 0, 10),
    commentCount: parseInt(video.statistics.commentCount || 0, 10),
  };
};
