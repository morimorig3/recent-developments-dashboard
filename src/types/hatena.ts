export interface HatenaRssItem {
  title: string;
  link: string;
  description: string;
  'dc:date': string;
  'dc:subject'?: string | string[];
  'hatena:bookmarkcount': string;
}

export interface HatenaRssResponse {
  'rdf:RDF': {
    item: HatenaRssItem[];
  };
}

export interface HatenaArticle {
  title: string;
  link: string;
  description: string;
  date: string;
  bookmarkcount: number;
  subjects: string[];
}
