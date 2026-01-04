# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

技術キャッチアップ用ダッシュボード。QiitaとZennの注目記事を少数厳選して表示するAstro製Webアプリ。

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
- **Astro 5** (SSR mode with Vercel adapter)
- **Tailwind CSS v4** (Vite plugin経由)
- **TypeScript** (strict mode)
- **Gemini AI** (記事要約生成)

### Directory Structure

```
src/
├── pages/
│   ├── index.astro      # メインページ（prerender: true）
│   └── api/deploy.ts    # Vercel再デプロイAPI
├── services/            # 外部API呼び出し
│   ├── getItemsFromQiita.ts
│   ├── getItemsFromZenn.ts
│   └── getSummaryFromUrl.ts  # Gemini要約生成
├── functions/           # データ変換
│   ├── formatQiitaArticles.ts
│   └── formatZennArticles.ts
├── types/               # 型定義
├── components/          # Astroコンポーネント
├── layouts/
└── utils/
    └── localStorage.ts  # クライアント側既読管理
```

### Data Flow
1. ビルド時に`index.astro`がQiita/Zenn APIから記事を取得（各5件、計10件）
2. 各記事に対してGemini APIで要約を生成（Card.astro内）
3. 記事データを`ICard`型に正規化し、作成日時でソート
4. クライアント側でlocalStorageを使い既読状態を管理
5. サイト別・既読状態のフィルタリング、ソートをクライアントサイドで実行

### API Endpoints Used
- Qiita: `https://qiita.com/api/v2/items` (過去1週間で40ストック以上)
- Zenn: `https://zenn.dev/api/articles` (トレンド記事)

### Environment Variables
- `GEMINI_API_KEY` - Google Generative AI用
- `VERCEL_TOKEN` - デプロイAPI用
