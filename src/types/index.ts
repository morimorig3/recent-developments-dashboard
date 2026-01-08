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
  site: 'zenn' | 'qiita';
}

export * from './zenn';
