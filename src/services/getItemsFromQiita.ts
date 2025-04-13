import type { QiitaArticle } from '../types/qiita';

export const getItemsFromQiita = async (count: number) => {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const formattedDate = oneWeekAgo.toISOString().split('T')[0];
    const response = await fetch(
      `https://qiita.com/api/v2/items?page=1&per_page=100&query=created:>${formattedDate}+stocks:>40`,
    );
    const data: QiitaArticle[] = await response.json();
    return data
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, count);
  } catch (error) {
    console.error(error);
    return [];
  }
};
