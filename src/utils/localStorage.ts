const STORAGE_KEY = 'read_articles';

interface ReadArticle {
  url: string;
  readAt: string;
}

/**
 * 3日以上経過した記事を削除する
 */
export const cleanupOldArticles = (): void => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 3);

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
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
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

// ブックマーク機能
const BOOKMARK_KEY = 'bookmarked_articles';

interface BookmarkedArticle {
  url: string;
  title: string;
  bookmarkedAt: string;
}

/**
 * ブックマークをトグルする
 * @param url 記事のURL
 * @param title 記事のタイトル
 * @returns ブックマーク追加の場合はtrue、解除の場合はfalse
 */
export const toggleBookmark = (url: string, title: string): boolean => {
  const bookmarks = getBookmarks();
  const existingIndex = bookmarks.findIndex((b) => b.url === url);

  if (existingIndex >= 0) {
    bookmarks.splice(existingIndex, 1);
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
    return false;
  } else {
    bookmarks.push({ url, title, bookmarkedAt: new Date().toISOString() });
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
    return true;
  }
};

/**
 * ブックマーク一覧を取得する
 * @returns ブックマーク一覧
 */
export const getBookmarks = (): BookmarkedArticle[] => {
  try {
    const data = localStorage.getItem(BOOKMARK_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * 記事がブックマーク済みかどうかを判定する
 * @param url 記事のURL
 * @returns ブックマーク済みの場合はtrue
 */
export const isBookmarked = (url: string): boolean => {
  return getBookmarks().some((b) => b.url === url);
};
