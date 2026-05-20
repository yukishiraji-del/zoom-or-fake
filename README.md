# Fake or Real?

World Mini App 向けのビデオ会議テーマゲームです。参加者画像を見て、本物の参加者かディープフェイクかを 10 ラウンドで判定します。

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Mini App setup

1. Developer portal で Mini App を作成します。
2. `.env.example` を参考に `.env.local` を作り、`NEXT_PUBLIC_WLD_APP_ID` を設定します。
3. 本番 URL を Mini App の Web URL として登録します。
4. Mini App 内では Wallet Auth でログインします。ゲーム後の追加 World ID verification は使いません。

## Deploy

一番簡単な公開方法は Vercel です。

1. この `zoom-or-fake` フォルダを GitHub repo に push します。
2. Vercel で `New Project` から repo を import します。
3. Framework は Next.js、Root Directory は `zoom-or-fake` にします。
4. Environment Variables に `NEXT_PUBLIC_WLD_APP_ID` を設定します。
5. Deploy 後の URL を World Developer Portal の Mini App Web URL に登録します。

注意: 現在の leaderboard はプロトタイプ用の in-memory 実装です。公開後にランキングを永続化する場合は、Vercel Postgres、Supabase、Redis などに差し替えてください。

## Photo assets

`public/images/photos` に、REAL 用 30 枚、FAKE 用 30 枚の写真アセットを同梱しています。

- REAL: Pravatar の CC0 avatar placeholder photo assets
- FAKE: 100k-faces API 経由の AI-generated face assets

本番キャンペーンでは、最終利用条件を確認したうえで、必要なら正式にライセンス取得した実写素材と合成素材へ差し替えてください。

```bash
npm run fetch:photos
```

で写真アセットを再取得できます。

## Prototype vector assets

初期プロトタイプ用の SVG アセットも再生成できますが、現行ゲームでは写真アセットを使っています。

```bash
npm run generate:assets
```
