import type { ICard } from '../types';
import { getSourceLabel } from '../config/primarySources';

export interface SourceGroup {
  site: string;
  label: string;
  articles: ICard[];
}

/**
 * ソース(site)ごとに記事をグルーピングする。
 *
 * グループ内は日付降順。グループ自体の並びは各グループの最新記事の日付降順にしている
 * （更新頻度の低いソースも必ず自分のセクションを持つため、この順序はあくまで
 * 目立たせる優先度の調整であって、記事が埋もれることはない）。
 *
 * @param articles ICard[]
 * @returns SourceGroup[]
 */
export const groupArticlesBySource = (articles: ICard[]): SourceGroup[] => {
  const bySite = new Map<string, ICard[]>();
  articles.forEach((article) => {
    const group = bySite.get(article.site);
    if (group) {
      group.push(article);
    } else {
      bySite.set(article.site, [article]);
    }
  });

  const byDateDesc = (a: ICard, b: ICard) =>
    new Date(b.createdAtRaw).getTime() - new Date(a.createdAtRaw).getTime();

  return Array.from(bySite.entries())
    .map(([site, groupArticles]) => ({
      site,
      label: getSourceLabel(site),
      articles: [...groupArticles].sort(byDateDesc),
    }))
    .sort((a, b) => byDateDesc(a.articles[0], b.articles[0]));
};
