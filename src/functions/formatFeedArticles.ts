import type { ICard } from '../types';
import type { FeedItem } from '../types/feed';
import type { PRIMARY_SOURCES } from '../config/primarySources';
import { formatDate } from './formatDate';

/**
 * FeedItem[]をICard[]に変換する
 *
 * source を PRIMARY_SOURCES の要素型で受けることで id が literal union に確定し、
 * ICard['site'] へのキャストが不要になる
 * @param items FeedItem[]
 * @param source 取得元の一次情報ソース定義
 * @returns ICard[]
 */
export const formatFeedArticles = (
  items: FeedItem[],
  source: (typeof PRIMARY_SOURCES)[number]
): ICard[] => {
  return items.map((item) => ({
    title: item.title,
    url: item.url,
    name: item.author,
    createdAt: formatDate(item.publishedAt),
    createdAtRaw: item.publishedAt,
    // RSS/Atomにいいね相当の値が無いためカード側で非表示にする
    likesCount: 0,
    site: source.id,
    category: 'primary',
    // 公式情報タブに分類フィルタは無いため実質未使用だが、ICardの必須フィールドを満たす
    filterKey: source.id,
  }));
};
