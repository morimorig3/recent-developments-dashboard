import { XMLParser } from 'fast-xml-parser';
import type { HatenaArticle, HatenaRssItem, HatenaRssResponse } from '../types/hatena';

const RSS_URL = 'https://b.hatena.ne.jp/hotentry/it.rss';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  htmlEntities: true,
});

const parseRssItem = (item: HatenaRssItem): HatenaArticle => {
  const subjects = item['dc:subject'];
  return {
    title: item.title,
    link: item.link,
    description: item.description || '',
    date: item['dc:date'],
    bookmarkcount: parseInt(item['hatena:bookmarkcount'] || '0', 10),
    subjects: Array.isArray(subjects) ? subjects : subjects ? [subjects] : [],
  };
};

export const getItemsFromHatena = async (count: number): Promise<HatenaArticle[]> => {
  try {
    const response = await fetch(RSS_URL);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const xml = await response.text();
    const parsed = parser.parse(xml) as HatenaRssResponse;
    const items = parsed?.['rdf:RDF']?.item;
    if (!Array.isArray(items)) {
      console.warn('Unexpected RSS structure from Hatena');
      return [];
    }
    return items.map(parseRssItem).slice(0, count);
  } catch (error) {
    console.error('Error fetching Hatena RSS:', error);
    return [];
  }
};
