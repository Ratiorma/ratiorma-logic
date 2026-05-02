export const extractVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const fetchVideoStats = async (videoId) => {
  const API_KEY = 'AIzaSyDAQEdcQfSbmTo28VBithf80XjfgaSK7eM';

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${API_KEY}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Googleエラー詳細: ${data.error?.message || response.statusText}`);
    }

    if (!data.items || data.items.length === 0) {
      throw new Error('動画が見つかりません。');
    }

    const video = data.items[0];
    return {
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.high.url,
      viewCount: parseInt(video.statistics.viewCount || 0, 10),
      likeCount: parseInt(video.statistics.likeCount || 0, 10),
      commentCount: parseInt(video.statistics.commentCount || 0, 10),
    };
  } catch (err) {
    throw new Error(err.message);
  }
};
