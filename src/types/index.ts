/**
 * カードコンポーネント インターフェース
 */
interface ICard {
  title: string;
  url: string;
  name: string;
  createdAt: string;
  likesCount: number;
  site: 'zenn' | 'qiita';
}

export type { ICard };
export * from './zenn';
