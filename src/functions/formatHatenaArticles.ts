import type { ICard } from '../types';
import type { HatenaArticle } from '../types/hatena';
import { formatDate } from './formatDate';

/**
 * HatenaArticle[]をICard[]に変換する
 * @param articles HatenaArticle[]
 * @returns ICard[]
 */
export const formatHatenaArticles = (articles: HatenaArticle[]): ICard[] => {
  return articles.map((article) => ({
    title: article.title,
    url: article.link,
    name: '',
    createdAt: formatDate(article.date),
    createdAtRaw: article.date,
    likesCount: article.bookmarkcount,
    site: 'hatena',
  }));
};
