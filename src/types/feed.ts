/**
 * RSS / Atom を区別せず1つに正規化した記事
 */
export interface FeedItem {
  title: string;
  url: string;
  author: string;
  publishedAt: string;
}

/**
 * 一次情報ソースの定義
 */
export interface PrimarySource {
  /** ICard.site に入る識別子 */
  id: string;
  /** カードに表示するソース名 */
  label: string;
  /** RSS または Atom のフィードURL */
  url: string;
  /** 取得件数。未指定なら PRIMARY_SOURCE_MAX_ITEMS */
  maxItems?: number;
}

/**
 * fast-xml-parser の出力。
 * 属性を持つ要素（例: <title type="html">）は { '#text': ... } 形式になる
 */
export type XmlText = string | number | { '#text'?: string | number };

export interface AtomLink {
  '@_href'?: string;
  '@_rel'?: string;
}

export interface AtomAuthor {
  name?: XmlText;
}

export interface AtomEntry {
  title?: XmlText;
  link?: AtomLink | AtomLink[];
  updated?: string;
  published?: string;
  author?: AtomAuthor | AtomAuthor[];
  content?: XmlText;
  summary?: XmlText;
}

export interface RssItem {
  title?: XmlText;
  link?: XmlText;
  pubDate?: string;
  description?: XmlText;
  'dc:creator'?: XmlText;
  'dc:date'?: string;
}

/**
 * RSS 2.0 / Atom / RSS 1.0(RDF) のいずれかでパースされうるトップレベル構造
 */
export interface FeedResponse {
  rss?: { channel?: { item?: RssItem | RssItem[] } };
  feed?: { entry?: AtomEntry | AtomEntry[] };
  'rdf:RDF'?: { item?: RssItem | RssItem[] };
}
