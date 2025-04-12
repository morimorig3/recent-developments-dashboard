export interface QiitaArticle {
  title: string;
  url: string;
  user: {
    name: string;
    profile_image_url: string;
  };
  created_at: string;
  likes_count: number;
}

export async function fetchQiitaArticles(): Promise<QiitaArticle[]> {
  const response = await fetch('https://qiita.com/api/v2/items?per_page=10');
  if (!response.ok) {
    throw new Error('Failed to fetch Qiita articles');
  }
  return response.json();
}
