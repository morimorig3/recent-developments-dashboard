/**
 * カードコンポーネント インターフェース
 */
export interface ICard {
  title: string;
  url: string;
  name: string;
  createdAt: string;
  likesCount: number;
  site: 'zenn' | 'qiita';
}

export interface Summary {
  title: string;
  body: string;
}

export * from './zenn';
