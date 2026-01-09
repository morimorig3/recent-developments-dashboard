# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

技術キャッチアップ用ダッシュボード。QiitaとZennの注目記事を少数厳選して表示するAstro製Webアプリ。毎朝4時に自動デプロイで情報更新。

## Commands

```bash
npm run dev         # 開発サーバー起動
npm run build       # プロダクションビルド
npm run preview     # ビルド結果のプレビュー
npm run lint        # ESLint実行（自動修正付き）
npm run format      # Prettier実行
npm run generate:og # OGP画像生成
```

## Architecture

### Tech Stack
- **Astro 5** (SSR mode with Vercel adapter, `output: 'server'`)
- **Tailwind CSS v4** (Vite plugin経由)
- **TypeScript** (strict mode)
- **Gemini AI** (`gemini-2.5-flash`でトレンドサマリー生成)

### Key Patterns

**ビルド時プリレンダリング**: `index.astro`は`export const prerender = true`でSSG。外部API呼び出しはビルド時のみ実行。

**クライアント状態管理**: `src/utils/localStorage.ts`で既読・ブックマーク状態をlocalStorageで永続化。3日で既読情報は自動削除。

**カスタムイベント連携**: `article-read`/`bookmark-changed`イベントでコンポーネント間の状態同期。

**型定義**: `ICard`インターフェース（`src/types/index.ts`）が記事データの共通型。各APIレスポンスはformat関数で正規化。

### Data Flow
1. ビルド時に`index.astro`がQiita/Zenn APIから記事取得（各5件）
2. 記事リストを`getDailySummary()`に渡してGemini AIでトレンドサマリー生成
3. 記事データを`ICard`型に正規化し作成日時でソート
4. クライアント側でフィルタ・ソート・既読/ブックマーク管理

### API Endpoints
- Qiita: `https://qiita.com/api/v2/items` (過去1週間で10ストック以上)
- Zenn: `https://zenn.dev/api/articles` (トレンド記事)
- Hatena: `https://b.hatena.ne.jp/hotentry/it.rss` (ITカテゴリホットエントリー、RSS形式)

### Environment Variables
- `GEMINI_API_KEY` - Google Generative AI用（未設定時はサマリー生成スキップ）
- `VERCEL_TOKEN` - デプロイAPI用
