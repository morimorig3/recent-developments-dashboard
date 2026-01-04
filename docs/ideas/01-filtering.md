# フィルタリング機能

## 概要

サイト別（Qiita / Zenn / すべて）や既読/未読で記事をフィルタリングできる機能。

## 現状の課題

- Qiita/Zenn の記事が混在して表示される
- 特定サイトの記事だけを見たい場合に不便
- 未読記事だけを確認したいニーズに対応できていない

## 提案内容

### サイトフィルタ

- 「すべて」「Qiita」「Zenn」のタブまたはボタンを追加
- 選択したサイトの記事のみを表示

### 既読/未読フィルタ

- 「すべて」「未読のみ」「既読のみ」の切り替え
- localStorageの既読データを活用

## 実装案

```typescript
// フィルタ状態の管理
type SiteFilter = 'all' | 'qiita' | 'zenn';
type ReadFilter = 'all' | 'unread' | 'read';

// クライアントサイドでフィルタリング
const filteredArticles = articles.filter(article => {
  const siteMatch = siteFilter === 'all' || article.site === siteFilter;
  const readMatch = readFilter === 'all' ||
    (readFilter === 'unread' && !isArticleRead(article.url)) ||
    (readFilter === 'read' && isArticleRead(article.url));
  return siteMatch && readMatch;
});
```

## UI案

ヘッダー下部にフィルタボタンを配置:

```
[すべて] [Qiita] [Zenn]  |  [すべて] [未読] [既読]
```

## メリット

- 「Zennだけ見たい」「まだ読んでない記事だけ確認したい」というニーズに対応
- 既存のlocalStorage機能を活用できる
- クライアントサイドで完結するため実装が容易
