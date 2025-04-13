import type { ICard, ZennArticle } from '../types';
import { formatDate } from './formatDate';

/**
 * ZennArticle[]をICard[]に変換する
 * @param articles ZennArticle
 * @returns ICard[]
 */
export const formatZennArticles = (articles: ZennArticle[]): ICard[] => {
  return articles.map((article) => ({
    title: article.title,
    url: `https://zenn.dev${article.path}`,
    name: article.user.name,
    createdAt: formatDate(article.published_at),
    likesCount: article.liked_count,
    site: 'zenn',
  }));
};
