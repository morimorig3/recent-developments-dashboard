# ブックマーク/後で読む機能

## 概要

気になる記事を「後で読む」リストに保存できる機能。

## 現状の課題

- 記事は「開く」か「開かない」の2択
- 気になるけど今は読めない記事を覚えておく手段がない
- 週末にまとめて読みたい記事を管理できない

## 提案内容

### 基本機能

- 各記事カードに「後で読む」ボタンを追加
- クリックでlocalStorageに保存
- ブックマーク済みの記事は視覚的に区別

### 追加機能（オプション）

- ブックマーク一覧ページ
- ブックマーク数の表示
- ブックマークのエクスポート

## 実装案

```typescript
// localStorage.ts に追加
const BOOKMARK_KEY = 'bookmarked_articles';

interface BookmarkedArticle {
  url: string;
  title: string;
  bookmarkedAt: string;
}

export function toggleBookmark(url: string, title: string): boolean {
  const bookmarks = getBookmarks();
  const existingIndex = bookmarks.findIndex(b => b.url === url);

  if (existingIndex >= 0) {
    bookmarks.splice(existingIndex, 1);
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
    return false; // ブックマーク解除
  } else {
    bookmarks.push({ url, title, bookmarkedAt: new Date().toISOString() });
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
    return true; // ブックマーク追加
  }
}

export function getBookmarks(): BookmarkedArticle[] {
  const data = localStorage.getItem(BOOKMARK_KEY);
  return data ? JSON.parse(data) : [];
}

export function isBookmarked(url: string): boolean {
  return getBookmarks().some(b => b.url === url);
}
```

## UI案

### カード内のブックマークボタン

```
┌─────────────────────────────────────┐
│ [NEW] タイトル           [★] [site]│  ← ★がブックマークボタン
│ @著者名                             │
│ 2025/01/04  ♥ 123                   │
├─────────────────────────────────────┤
│ 要約を見る ▼                        │
└─────────────────────────────────────┘
```

- 未ブックマーク: ☆（白抜き）
- ブックマーク済み: ★（塗りつぶし、黄色）

### ヘッダーにブックマーク数表示

```
がんばらない技術キャッチアップ    ★ 3件
```

クリックでブックマーク一覧を表示（モーダルまたは別ページ）

## メリット

- 気になる記事をマークしておき、週末にまとめて読める
- localStorageに保存して永続化（ブラウザを閉じても保持）
- 「とりあえずマーク」で心理的負担を軽減
