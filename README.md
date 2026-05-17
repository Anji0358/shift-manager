# Shift Manager

ケータリング現場向けのシフト管理アプリです。

案件ごとの勤務枠、必要人数、スタッフの勤務不可情報、確定シフト、就労報告、月次集計を管理できます。

## コンセプト

ケータリング現場では、案件ごとに勤務日・勤務時間・集合場所・必要人数・食事の有無などが異なります。

このアプリでは、管理者が案件と勤務枠を作成し、スタッフの勤務不可情報を考慮しながらシフトを確定できます。

スタッフは自分の確定シフトを確認し、勤務後に就労報告を提出します。管理者は就労報告を承認し、月次の勤務時間や給与見込みを確認できます。

## 主な機能

### 管理者側

- 案件一覧の表示
- 案件の作成
- 案件詳細の表示
- 勤務枠の作成
- シフト確定
- シフトキャンセル
- 勤務不可情報を考慮した候補者判定
- 就労報告の承認・差し戻し
- 月次集計
- スタッフ登録
- スタッフの退職済み変更
- 管理者ダッシュボード

### 勤務者側

- 確定シフト一覧
- 月間シフトカレンダー
- 勤務不可情報の登録・削除
- 就労報告の提出
- 就労履歴の確認
- 月次集計
- スタッフダッシュボード

管理者も現場勤務に入る可能性があるため、勤務者画面は ADMIN / STAFF の両方が利用できます。

## 使用技術

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- PostgreSQL
- Server Actions
- Git / GitHub

## ディレクトリ構成

```txt
src
├── app
│   ├── admin
│   └── staff
├── components
│   ├── shared
│   └── ui
├── features
│   ├── dashboard
│   ├── employees
│   ├── jobs
│   ├── job-shift-slots
│   ├── payroll
│   ├── shift-assignments
│   ├── unavailable-times
│   └── work-reports
└── lib
    ├── auth
    ├── format.ts
    ├── month.ts
    ├── prisma.ts
    └── validation.ts
```

## セットアップ

### 1. リポジトリをクローン

```bash
git clone <repository-url>
cd shift-manager
```

### 2. パッケージをインストール

```bash
npm install
```

### 3. `.env` を作成

プロジェクト直下に `.env` を作成し、以下を設定します。

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=verify-full"
```

Neon を使う場合は、Neon の接続文字列を設定します。

```env
DATABASE_URL="postgresql://neondb_owner:xxxxx@ep-xxxxx.ap-northeast-1.aws.neon.tech/neondb?sslmode=verify-full"
```

### 4. Prisma のマイグレーションを実行

```bash
npx prisma migrate dev
```

### 5. seed を実行

```bash
npx prisma db seed
```

### 6. 開発サーバーを起動

```bash
npm run dev
```

### 7. ブラウザで開く

```txt
http://localhost:3000
```

## デモ用ユーザー

現在は認証導入前のため、仮ログインユーザーとして以下を使用しています。

```txt
管理者: emp_1
スタッフ: emp_2
```

スタッフ画面では `emp_2` を固定で使用しています。

## 今後の改善予定

- Auth.js によるログイン機能
- 管理者・スタッフの権限制御
- 本番用 PostgreSQL との接続
- Vercel へのデプロイ
- フォームエラーのインライン表示
- toast による通知表示

## 環境変数

このアプリでは以下の環境変数を使用します。

| 変数名            | 内容                                          |
| ----------------- | --------------------------------------------- |
| `DATABASE_URL`    | PostgreSQL の接続URL                          |
| `AUTH_SECRET`     | Auth.js の署名用シークレット                  |
| `AUTH_TRUST_HOST` | Vercelなど本番環境でAuth.jsを動かすための設定 |

`.env.example` をコピーして `.env.local` を作成してください。

```bash
cp .env.example .env.local

---

```
