# ソート切り替え機能

## 概要

記事の表示順を「新着順」「いいね数順」で切り替えられる機能。

## 現状の課題

- 作成日時の新しい順で固定されている
- 人気記事から優先的に見たい場合に対応できない

## 提案内容

### ソートオプション

1. **新着順（デフォルト）**: 作成日時が新しい順
2. **いいね数順**: いいね数（Qiita: stocks, Zenn: likes）が多い順

## 実装案

```typescript
// ソート状態の管理
type SortOption = 'date' | 'likes';

// ソート処理
const sortedArticles = [...articles].sort((a, b) => {
  if (sortOption === 'date') {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  } else {
    return b.likesCount - a.likesCount;
  }
});
```

## UI案

フィルタエリアにソート切り替えボタンを配置:

```
並び替え: [新着順] [いいね数順]
```

または、ドロップダウン形式:

```
並び替え: [新着順 ▼]
```

## メリット

- 時間がない時は「いいね数順」で人気記事から優先的にチェック
- じっくり読みたい時は「新着順」で最新情報をキャッチ
- ユーザーの状況に応じた柔軟な閲覧が可能
