import type { PrimarySource } from '../types/feed';

/** 1ソースあたりの取得件数。全体の上限は設けず、ソースごとに必ずこの件数を表示する */
export const PRIMARY_SOURCE_MAX_ITEMS = 3;

/** フィード取得のタイムアウト(ms)。1本ハングしてもビルドを止めないため */
export const FEED_TIMEOUT_MS = 10000;

/**
 * 一次情報ソース一覧。
 * ソースの追加・削除・件数調整はこの配列だけを編集すれば完結する。
 *
 * GitHubの生ログ（commits/releases）は内容の価値が低いため使わない方針。
 * 公式ブログ・公式アナウンスのような、読む価値のある情報源だけを載せる。
 */
export const PRIMARY_SOURCES = [
  {
    id: 'webdev',
    label: 'web.dev',
    url: 'https://web.dev/static/blog/feed.xml',
  },
  {
    id: 'chrome',
    label: 'Chrome Developers',
    url: 'https://developer.chrome.com/static/blog/feed.xml',
  },
  {
    id: 'v8',
    label: 'V8 Blog',
    url: 'https://v8.dev/blog.atom',
  },
  {
    id: 'webkit',
    label: 'WebKit Blog',
    url: 'https://webkit.org/feed/atom/',
  },
  {
    id: 'mdn',
    label: 'MDN Blog',
    url: 'https://developer.mozilla.org/en-US/blog/rss.xml',
  },
  {
    id: 'mozhacks',
    label: 'Mozilla Hacks',
    url: 'https://hacks.mozilla.org/feed/',
  },
  {
    id: 'rfc',
    label: 'IETF RFC',
    url: 'https://www.rfc-editor.org/rfcrss.xml',
  },
  {
    id: 'react',
    label: 'React Blog',
    url: 'https://react.dev/rss.xml',
  },
  {
    id: 'nextjs',
    label: 'Next.js Blog',
    url: 'https://nextjs.org/feed.xml',
  },
  {
    id: 'vite',
    label: 'Vite Blog',
    url: 'https://vite.dev/blog.rss',
  },
  {
    id: 'nodejs',
    label: 'Node.js Blog',
    url: 'https://nodejs.org/en/feed/blog.xml',
  },
] as const satisfies readonly PrimarySource[];

export type PrimarySourceId = (typeof PRIMARY_SOURCES)[number]['id'];

const SOURCE_LABELS = new Map<string, string>(
  PRIMARY_SOURCES.map((source) => [source.id, source.label]),
);

/**
 * ソースIDから表示名を引く。未知のIDはそのまま返す（Qiita等のキュレーション側）
 */
export const getSourceLabel = (id: string): string => SOURCE_LABELS.get(id) ?? id;
