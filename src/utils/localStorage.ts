const STORAGE_KEY = 'read_articles';

interface ReadArticle {
  url: string;
  readAt: string;
}

/**
 * 1週間以上経過した記事を削除する
 */
export const cleanupOldArticles = (): void => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const readArticles = getReadArticles();
  const filteredArticles = readArticles.filter((article) => {
    const readDate = new Date(article.readAt);
    return readDate > oneWeekAgo;
  });

  if (filteredArticles.length !== readArticles.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredArticles));
  }
};

/**
 * 記事のURLをlocalStorageに保存する
 * @param url 記事のURL
 */
export const saveReadArticle = (url: string): void => {
  const readArticles = getReadArticles();
  const existingArticle = readArticles.find((article) => article.url === url);

  if (!existingArticle) {
    readArticles.push({
      url,
      readAt: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readArticles));
  }
};

/**
 * 既読記事のURL一覧を取得する
 * @returns 既読記事のURL一覧
 */
export const getReadArticles = (): ReadArticle[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

/**
 * 記事が既読かどうかを判定する
 * @param url 記事のURL
 * @returns 既読の場合はtrue
 */
export const isArticleRead = (url: string): boolean => {
  const readArticles = getReadArticles();
  return readArticles.some((article) => article.url === url);
};
