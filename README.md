# がんばらない技術キャッチアップ

![キャプチャ](./resources/screenshot.png)

https://recent-developments-dashboard.vercel.app/

技術キャッチアップが苦手な人向けに作ってみたアプリケーション

- 件数を少なくしたい
- それでも質の高いものだけをみたい

というわがままな要望を叶えるために作成

# 仕様

- Qiita・Zenn・はてなブックマークの良さそうな記事をまとめて表示してくれます
- 一度読んだ記事からはnewアイコンが消えてくれる（newがついてるやつだけポチッとしておけばいい！）
- 毎朝4時に自動デプロイで情報が更新される
- 「キュレーション記事」と「公式情報」をタブで切り替えられる

タブを分けているのは、キュレーション記事（いいね数という人気度でランキングされる）と公式情報（人気度の指標がなく更新頻度も低い）で見方が違うため。
1つのリストに混ぜると、更新頻度の低い公式情報が人気記事に埋もれて見逃してしまう。

## Qiita

過去1週間で40ストックされた記事を若い順に5件

`https://qiita.com/api/v2/items?page=1&per_page=100&query=created:>${oneWeekAgo}+stocks:>40`

ページングはしていない

## Zenn

トレンドの上位10件

`https://zenn.dev/api/articles`

現時点ではトレンドが帰ってきてそうだった

API仕様書は公開されていないので、正確ではないし変更される可能性がある

## Hatena

ITカテゴリのホットエントリーから5件

`https://b.hatena.ne.jp/hotentry/it.rss`

RSS形式なので `fast-xml-parser` でパースしている

# 公式情報

ブラウザ・仕様・ライブラリの公式フィード（RSS / Atom）を各3件まで取得している。
更新頻度の低い一次情報を見逃さないことが目的。

RSSとAtomはどちらもXMLベースなので、`src/services/getItemsFromFeed.ts` が両方を判別して同じ内部構造（`FeedItem`）に正規化している。

| ソース | カバー範囲 | 形式 | URL |
| --- | --- | --- | --- |
| web.dev | Web Vitals・Baseline情報 | RSS | `https://web.dev/static/blog/feed.xml` |
| Chrome Developers | developer.chrome.com全般 | RSS | `https://developer.chrome.com/static/blog/feed.xml` |
| V8 Blog | GC・最適化・JS実行系 | Atom | `https://v8.dev/blog.atom` |
| WebKit Blog | Safari/WebKitの実装 | Atom | `https://webkit.org/feed/atom/` |
| MDN Blog | ブラウザ横断の仕様解説 | RSS | `https://developer.mozilla.org/en-US/blog/rss.xml` |
| Mozilla Hacks | Firefox・Web標準 | RSS | `https://hacks.mozilla.org/feed/` |
| IETF RFC | 新規発行RFC | RSS | `https://www.rfc-editor.org/rfcrss.xml` |
| React Blog | Reactの公式ブログ（リリース・Foundation・セキュリティ告知等） | RSS | `https://react.dev/rss.xml` |
| Next.js Blog | Next.jsの公式ブログ（リリース解説・セキュリティ情報等） | RSS | `https://nextjs.org/feed.xml` |
| Vite Blog | Viteの公式ブログ（メジャーリリース解説） | RSS | `https://vite.dev/blog.rss` |
| Node.js Blog | Node.jsのリリース | RSS | `https://nodejs.org/en/feed/blog.xml` |

## ソース選定の方針

「一次情報を見逃さない」が目的なので、GitHubの生ログ（commits/releases）は使わない方針にしている。公式ブログ・公式アナウンスのような、内容として読む価値のあるものだけを載せる。新ソースを足す際もこの方針を踏襲すること。

## 設定

ソースの追加・削除・取得件数はすべて `src/config/primarySources.ts` にまとまっている。ここだけ編集すれば済む。

## 表示件数・表示形式

全体の上限は設けていない。各ソース最新3件（`PRIMARY_SOURCE_MAX_ITEMS`）を、ソースごとにセクション分けして表示している（`src/functions/groupArticlesBySource.ts`）。
以前は1つのフラットな新着順リストにまとめ、全体を最大40件に切っていたが、それだと更新頻度の低いソース（V8 Blog等）の記事が埋もれて1件も出なくなることがあった。
ソースごとに専用セクションを持たせることで、更新頻度に関わらずどのソースも必ず表示される。

セクション自体の並び順は各セクション内の最新記事の日付降順（更新が新しいソースほど上に来る）。

# やってみたこと

- Astro使用してみた
- ほぼAIにコーディングしてもらいました（Cursorエディター）
- 要約をAIに生成させる

ほぼAIのレビューしてるだけだったのでタイピング量かなり減って時代を感じた
平気で正しそうな嘘コード作ってくるので面倒見てあげる必要はある
無理させすぎない方がいい回答出してくれる

AIに生成させた文章を静的サイトとして公開するのはアリなのか少し不安なのでこの機能は廃止するかもしれない