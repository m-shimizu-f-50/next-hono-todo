# next-hono-todo

## 概要

Next.js（フロントエンド）と Hono.js（バックエンド）を使用したフルスタック Todo アプリケーションです。
フロントエンドエンジニアとしてバックエンドの知識を広げるため、自己研鑽の一環として開発しました。

## 開発の背景・目的

フロントエンドエンジニアとして業務に取り組む中で、バックエンドの知識が不足していることを課題に感じていました。
API の設計や REST の概念を実際に手を動かして理解するために、本アプリを開発しました。

技術選定においては以下の点を意識しました。

- **Next.js**：業界でのシェアが高まっており、実務での需要が増加していると判断
- **Hono.js**：TypeScript との親和性が高く、Express.js と比べてよく使う機能（CORS・JSON の解析など）が本体に内蔵されているためセットアップがシンプル。エッジ環境（Cloudflare Workers）への対応など将来性も考慮して選定

## Express.js と Hono.js の比較

Hono.js は Express.js と書き方が非常に似ていますが、以下の点で違いがあります。

### 1. セットアップ

Express.js では本体以外に型定義・CORS など追加インストールが必要ですが、Hono.js は本体と Node.js 用アダプターだけで動きます。

```bash
# Express.js
npm install express cors
npm install -D @types/express @types/cors typescript ts-node

# Hono.js
npm install hono @hono/node-server
npm install -D typescript tsx
```

### 2. サーバーの起動

Hono.js は `serve` に `app.fetch` を渡す形になっています。
これは Hono.js が Cloudflare Workers などでも動くよう **Web 標準の fetch API** をベースに設計されているためです。

```typescript
// Express.js
const app = express();
app.listen(3001, () => {
	console.log('Server is running on http://localhost:3001');
});

// Hono.js
const app = new Hono();
serve(
	{
		fetch: app.fetch,
		port: 3001,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
```

### 3. ルーターの定義

`Router()` と `new Hono()`、`app.use()` と `app.route()` の違いがありますが書き方は非常に似ています。

```typescript
// Express.js
const router = Router()
router.get('/', (req, res) => { ... })
app.use('/todos', router)

// Hono.js
const todos = new Hono()
todos.get('/', (c) => { ... })
app.route('/todos', todos)
```

### 4. リクエストとレスポンス

Express.js は `req`・`res` の 2 つのオブジェクトを使いますが、Hono.js は `c`（Context）1 つにまとまっています。

```typescript
// Express.js
router.get('/', (req, res) => {
	const id = req.params.id; // URLパラメータ
	const body = req.body; // リクエストボディ
	res.status(200).json(data); // レスポンス
});

// Hono.js
todos.get('/', (c) => {
	const id = c.req.param('id'); // URLパラメータ
	const body = await c.req.json(); // リクエストボディ
	return c.json(data, 200); // レスポンス
});
```

### 5. JSON の受け取り

Express.js では JSON を受け取るためにミドルウェアの設定が必要ですが、Hono.js は不要です。

```typescript
// Express.js：ミドルウェアの設定が必要
app.use(express.json());
router.post('/', (req, res) => {
	const body = req.body; // ミドルウェアがないとundefinedになる
});

// Hono.js：そのまま使える
todos.post('/', async (c) => {
	const body = await c.req.json();
});
```

### 6. CORS の設定

Express.js では外部パッケージのインストールが必要ですが、Hono.js は本体に内蔵されています。

```typescript
// Express.js：外部パッケージが必要
import cors from 'cors'; // npm install cors が必要
app.use(cors({ origin: 'http://localhost:3000' }));

// Hono.js：本体に内蔵されているのでインストール不要
import { cors } from 'hono/cors';
app.use('*', cors({ origin: 'http://localhost:3000' }));
```

### 7. ミドルウェアの仕組み

ミドルウェアとは「API にアクセスする前後に共通で実行したい処理」のことです。
認証チェックやログ出力などを全エンドポイントに対して共通で実行できます。
Hono.js もミドルウェアの仕組み自体は Express.js と同様に存在します。

```typescript
// Express.js
app.use((req, res, next) => {
	// 認証処理など...
	next(); // 次の処理へ進む
});

// Hono.js
app.use('*', async (c, next) => {
	// 認証処理など...
	await next(); // 次の処理へ進む
});
```

### 8. TypeScript 対応

Express.js では TypeScript の型定義を別途インストールする必要がありますが、
Hono.js は最初から TypeScript に対応しているため追加設定なしで型補完が効きます。

```typescript
// Express.js：型定義パッケージを別途インストールが必要
// npm install @types/express
router.post('/', (req: Request, res: Response) => { ... })

// Hono.js：最初から型補完が効く
todos.post('/', async (c) => { ... })
```

### 9. ステータスコードの指定

```typescript
// Express.js：メソッドチェーンが必要
res.status(201).json(newTodo);

// Hono.js：第二引数に渡すだけ
return c.json(newTodo, 201);
```

### まとめ

| 比較項目               | Express.js           | Hono.js                              |
| ---------------------- | -------------------- | ------------------------------------ |
| 登場年                 | 2010年               | 2022年                               |
| セットアップ           | 追加パッケージが必要 | 最小構成でOK                         |
| リクエスト・レスポンス | `req` / `res` の2つ  | `c`（Context）1つ                    |
| JSON の受け取り        | ミドルウェアが必要   | 不要                                 |
| CORS                   | 外部パッケージが必要 | 本体に内蔵                           |
| ミドルウェアの仕組み   | あり                 | あり（書き方はほぼ同じ）             |
| TypeScript 対応        | 別途型定義が必要     | 最初から対応                         |
| ステータスコード指定   | メソッドチェーン     | 第二引数                             |
| 動作環境               | Node.js のみ         | Node.js・Cloudflare Workers・Deno 等 |
| 情報量                 | 豊富                 | まだ少ない                           |

---

## 開発を通じて学んだこと

- REST API の設計（GET / POST / PATCH / DELETE）の基本的な考え方
- フロントエンドとバックエンドの通信における CORS の仕組みと対処法
- ミドルウェアの概念（API アクセス前後に共通処理を挟む仕組み）
- Hono.js と Express.js の違い（よく使う機能の内蔵・TypeScript 対応・記述のシンプルさ）
- Git の運用（コミット粒度・コミットメッセージの命名規則）
- 環境変数を用いた API エンドポイントの管理方法

## 技術スタック

| レイヤー       | 技術                                |
| -------------- | ----------------------------------- |
| フロントエンド | Next.js / TypeScript / Tailwind CSS |
| バックエンド   | Hono.js / Node.js / TypeScript      |

## 機能一覧

- Todo の一覧表示
- Todo の新規作成
- Todo の完了・未完了の切り替え
- Todo の削除

## 今後の改善点

現状はデータをメモリ上で管理しているため、サーバーを再起動するとデータがリセットされます。
本番環境を想定する場合は PostgreSQL などのデータベースへの永続化が必要と認識しています。

また今後は以下の点にも取り組んでいきたいと考えています。

- データベースとの連携（PostgreSQL / Supabase）
- 認証機能の追加（NextAuth.js）
- Vercel・Render へのデプロイ

## セットアップ

### バックエンド

```bash
cd backend
npm install
npm run dev
```

サーバーが `http://localhost:3001` で起動します。

### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

アプリが `http://localhost:3000` で起動します。

### 環境変数

`frontend/.env.local` を作成して以下を設定してください。

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## API エンドポイント

| メソッド | URL        | 処理               |
| -------- | ---------- | ------------------ |
| GET      | /todos     | 一覧取得           |
| POST     | /todos     | 新規作成           |
| PATCH    | /todos/:id | 完了・未完了の更新 |
| DELETE   | /todos/:id | 削除               |
