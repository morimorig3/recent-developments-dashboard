import type { PrimarySourceId } from '../config/primarySources';

/** キュレーション記事のソース */
export type CuratedSite = 'zenn' | 'qiita' | 'hatena';

/** 記事のソース（キュレーション + 一次情報） */
export type ArticleSite = CuratedSite | PrimarySourceId;

/** 記事の大分類。タブの出し分けとカードの表示差分に使う */
export type ArticleCategory = 'curated' | 'primary';

/**
 * カードコンポーネント インターフェース
 */
export interface ICard {
  title: string;
  url: string;
  name: string;
  createdAt: string;
  createdAtRaw: string;
  likesCount: number;
  site: ArticleSite;
  category: ArticleCategory;
  /** フィルタ用キー。curated はサイト名、primary は分類(group) */
  filterKey: string;
}

export * from './zenn';
export * from './hatena';
