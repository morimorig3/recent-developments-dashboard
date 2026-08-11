# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

技術キャッチアップ用ダッシュボード。QiitaとZennの注目記事、およびブラウザ・仕様の一次情報を少数厳選して表示するAstro製Webアプリ。毎朝4時に自動デプロイで情報更新。

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
- **Gemini AI** (`gemini-flash-latest`でトレンドサマリー生成)

### Key Patterns

**ビルド時プリレンダリング**: `index.astro`は`export const prerender = true`でSSG。外部API呼び出しはビルド時のみ実行。

**クライアント状態管理**: `src/utils/localStorage.ts`で既読・ブックマーク状態をlocalStorageで永続化。3日で既読情報は自動削除。

**カスタムイベント連携**: `article-read`/`bookmark-changed`イベントでコンポーネント間の状態同期。

**型定義**: `ICard`インターフェース（`src/types/index.ts`）が記事データの共通型。各APIレスポンスはformat関数で正規化。`category`（`curated`/`primary`）でタブとカード表示を出し分ける。

**タブ構成**: 「キュレーション記事」と「公式情報」をタブで分離。キュレーション記事は`ArticlePanel.astro`（フラットな新着順リスト＋サイトフィルタ）、公式情報は`ArticlePanel`の`articles`propを省略してslotに`PrimarySourceSection.astro`をソース単位で並べたグループ表示（フィルタなし）。

**パネル単位のスクリプト**: Astroのコンポーネント内`<script>`はインスタンスごとではなく1度だけ実行される。そのため`ArticlePanel.astro`のスクリプトは`[data-article-panel]`を走査し、状態をクロージャに閉じてパネル内スコープで要素を取得する。

**一次情報の設定**: ソース定義・取得件数・ノイズ対策キーワードは`src/config/primarySources.ts`に集約。新ソース追加はこの配列の編集だけで済む。

### Data Flow
1. ビルド時に`index.astro`がQiita/Zenn/Hatena APIと公式情報フィード11本を並列取得（各ソース最大3件、`PRIMARY_SOURCE_MAX_ITEMS`）
2. 各レスポンスをformat関数で`ICard`型に正規化
3. キュレーション群・公式情報群それぞれにURLベースの重複排除（`dedupeArticles`）を適用（全体で1回にすると公式情報が消えるため別々に）
4. 公式情報は`groupArticlesBySource`でソースごとにグルーピング（全体の件数上限は無し。ソースごとに専用セクションを持つため、更新頻度の低いソースも必ず表示される）
5. キュレーション記事のみを`getDailySummary()`に渡してGemini AIでトレンドサマリー生成
6. クライアント側でキュレーションパネルのみフィルタ・ソート管理、既読/ブックマークはCard単位で両パネル共通

### API Endpoints
- Qiita: `https://qiita.com/api/v2/items` (過去1週間で40ストック以上)
- Zenn: `https://zenn.dev/api/articles` (トレンド記事)
- Hatena: `https://b.hatena.ne.jp/hotentry/it.rss` (ITカテゴリホットエントリー、RSS形式)
- 公式情報: RSS/Atom 11ソース（`src/config/primarySources.ts`参照、GitHubの生ログは掲載しない方針）。`getItemsFromFeed`が両形式を判別して正規化

### Environment Variables
- `GEMINI_API_KEY` - Google Generative AI用（未設定時はサマリー生成スキップ）
- `VERCEL_TOKEN` - デプロイAPI用
