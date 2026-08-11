import { XMLParser } from 'fast-xml-parser';
import { FEED_TIMEOUT_MS, PRIMARY_SOURCE_MAX_ITEMS } from '../config/primarySources';
import type {
  AtomAuthor,
  AtomEntry,
  AtomLink,
  FeedItem,
  FeedResponse,
  PrimarySource,
  RssItem,
  XmlText,
} from '../types/feed';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  htmlEntities: true,
  // 数字だけのリリースタイトル等が数値に変換されるのを防ぐ
  parseTagValue: false,
});

const USER_AGENT =
  'recent-developments-dashboard (+https://recent-developments-dashboard.vercel.app/)';

const ACCEPT = 'application/atom+xml, application/rss+xml, application/xml, text/xml';

/**
 * 属性を持つ要素は { '#text': ... } になるため、テキストだけを取り出す
 */
const textOf = (value: XmlText | undefined): string => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  // parseTagValue: false により通常は数値にならないが、属性値等での混入に備えた保険
  if (typeof value === 'number') return String(value);
  return value['#text'] === undefined ? '' : String(value['#text']);
};

/**
 * 要素が1件のときオブジェクトで返るため配列に揃える
 */
const toArray = <T>(value: T | T[] | undefined): T[] =>
  Array.isArray(value) ? value : value ? [value] : [];

/**
 * GitHubのcommit/release atomはタイトルに改行とインデントが含まれる
 */
const normalizeTitle = (title: string): string => title.trim().replace(/\s+/g, ' ');

/**
 * Atomのlinkは属性。複数ある場合は alternate を優先する
 */
const pickAtomLink = (link: AtomLink | AtomLink[] | undefined): string => {
  const links = toArray(link);
  const alternate = links.find((l) => l['@_rel'] === 'alternate' || l['@_rel'] === undefined);
  return alternate?.['@_href'] ?? links[0]?.['@_href'] ?? '';
};

const authorNameOf = (author: AtomAuthor | AtomAuthor[] | undefined): string =>
  textOf(toArray(author)[0]?.name);

const parseAtomEntry = (entry: AtomEntry): FeedItem => ({
  title: normalizeTitle(textOf(entry.title)),
  url: pickAtomLink(entry.link),
  author: authorNameOf(entry.author),
  // GitHubのcommit atomは updated しか持たない
  publishedAt: entry.published || entry.updated || '',
});

const parseRssItem = (item: RssItem): FeedItem => ({
  title: normalizeTitle(textOf(item.title)),
  url: textOf(item.link),
  author: textOf(item['dc:creator']),
  publishedAt: item.pubDate || item['dc:date'] || '',
});

/**
 * 外部フィード由来のURLをそのままhrefに流さないための検証。
 * javascript: 等のスキームを弾く
 */
const isSafeUrl = (url: string): boolean => /^https?:\/\//i.test(url);

/**
 * パースできない日付を弾く。
 * 通すと formatDate が NaN/NaN/NaN を出し、日付ソートの比較関数も NaN を返して
 * 並び順が未定義になる
 */
const hasValidDate = (publishedAt: string): boolean => !Number.isNaN(Date.parse(publishedAt));

/**
 * RSS / Atom フィードを取得して FeedItem[] に正規化する
 * @param source 一次情報ソース定義
 * @returns FeedItem[]（取得失敗時は空配列）
 */
export const getItemsFromFeed = async (source: PrimarySource): Promise<FeedItem[]> => {
  try {
    const response = await fetch(source.url, {
      headers: { 'User-Agent': USER_AGENT, Accept: ACCEPT },
      signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
    });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const xml = await response.text();
    const parsed = parser.parse(xml) as FeedResponse;

    const atomEntries = toArray(parsed?.feed?.entry);
    const rssItems = toArray(parsed?.rss?.channel?.item ?? parsed?.['rdf:RDF']?.item);

    let items: FeedItem[];
    if (atomEntries.length > 0) {
      items = atomEntries.map(parseAtomEntry);
    } else if (rssItems.length > 0) {
      items = rssItems.map(parseRssItem);
    } else if (parsed?.feed || parsed?.rss || parsed?.['rdf:RDF']) {
      // 構造は正しいが項目が0件（障害調査時に構造不明と区別できるようにする）
      return [];
    } else {
      console.warn(`Unexpected feed structure from ${source.id}`);
      return [];
    }

    return items
      .filter((item) => item.title && isSafeUrl(item.url) && hasValidDate(item.publishedAt))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, source.maxItems ?? PRIMARY_SOURCE_MAX_ITEMS);
  } catch (error) {
    console.error(`Error fetching feed (${source.id}):`, error);
    return [];
  }
};
