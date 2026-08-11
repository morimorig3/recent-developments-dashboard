import type { ICard } from '../types';

/**
 * 比較用にURLを正規化する。
 * プロトコルをhttpsに統一 / ホストを小文字化 / クエリ・ハッシュを除去 / 末尾スラッシュを除去
 */
const normalizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/\/+$/, '');
    return `https://${parsed.host.toLowerCase()}${path}`;
  } catch {
    // 相対URL等でパースできない場合は生URLをキーにする
    return url;
  }
};

/**
 * URLベースで記事を重複排除する（先勝ち）
 *
 * キュレーション群と一次情報群には別々に適用すること。
 * 全体に一度だけ適用すると、Hatenaに一次情報記事が載った日に
 * 一次情報タブからその記事が消えてしまう。
 *
 * @param articles ICard[]
 * @returns 重複を除いたICard[]
 */
export const dedupeArticles = (articles: ICard[]): ICard[] => {
  const seen = new Map<string, ICard>();

  articles.forEach((article) => {
    const key = normalizeUrl(article.url);
    if (!seen.has(key)) {
      seen.set(key, article);
    }
  });

  return Array.from(seen.values());
};
