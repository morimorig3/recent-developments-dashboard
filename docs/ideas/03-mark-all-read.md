# 一括既読ボタン

## 概要

表示中の記事をすべて既読にするボタン。

## 現状の課題

- 記事を1つずつクリックして既読化する必要がある
- 忙しい日にサッと確認だけしたい場合に手間がかかる

## 提案内容

「すべて既読にする」ボタンを追加し、ワンクリックで全記事を既読状態にする。

## 実装案

```typescript
// localStorage.ts に追加
export function markAllAsRead(urls: string[]): void {
  const readArticles = getReadArticles();
  const now = new Date().toISOString();

  urls.forEach(url => {
    if (!readArticles.some(article => article.url === url)) {
      readArticles.push({ url, readAt: now });
    }
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(readArticles));
}
```

```astro
<!-- ボタンコンポーネント -->
<button id="mark-all-read" class="...">
  すべて既読にする
</button>

<script>
  document.getElementById('mark-all-read')?.addEventListener('click', () => {
    const urls = Array.from(document.querySelectorAll('[data-article-url]'))
      .map(el => el.getAttribute('data-article-url'));
    markAllAsRead(urls);
    // NEWバッジを非表示にする
    document.querySelectorAll('.new-badge').forEach(badge => {
      badge.classList.add('hidden');
    });
  });
</script>
```

## UI案

ヘッダー付近またはフィルタエリアに配置:

```
[すべて既読にする]
```

確認ダイアログを表示してもよい:

```
「10件の記事を既読にしますか？」
[キャンセル] [既読にする]
```

## メリット

- 忙しい日にサッと確認だけして全部既読にできる
- 「がんばらない」コンセプトにマッチ
- 翌日は新しい記事だけに集中できる
