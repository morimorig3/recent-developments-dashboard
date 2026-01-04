import type { ICard } from '../types';
import type { QiitaArticle } from '../types/qiita';
import { formatDate } from './formatDate';

/**
 * QiitaArticle[]をICard[]に変換する
 * @param articles QiitaArticle[]
 * @returns ICard[]
 */
export const formatQiitaArticles = (articles: QiitaArticle[]): ICard[] => {
  return articles.map((article) => ({
    title: article.title,
    url: article.url,
    name: article.user.id,
    createdAt: formatDate(article.created_at),
    createdAtRaw: article.created_at,
    likesCount: article.likes_count,
    site: 'qiita',
  }));
};
