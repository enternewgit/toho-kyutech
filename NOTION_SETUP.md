# Notion API セットアップガイド

## 1. Notion Integration を作成

1. [Notion Developers](https://developers.notion.com/) にアクセス
2. 「My integrations」→「+ New integration」をクリック
3. 以下を設定：
   - Name: 東方求徹区 Website
   - Logo: お好みで
   - Associated workspace: あなたのワークスペース
4. 「Submit」をクリック
5. **Internal Integration Token** をコピー（後で使用）

## 2. Notion データベースを作成

1. Notionで新しいページを作成
2. 「/database」と入力してデータベースを作成
3. 以下のプロパティを設定：

### 必要なプロパティ（実際の設定に合わせて）:
- **名前** (タイトル) - タイトル型
- **テキスト** (説明) - リッチテキスト型  
- **選択** (カテゴリ) - セレクト型
  - オプション: `Music`, `Illustration`, `Doujinshi`（または `音楽`, `イラスト`, `同人誌`）
- **ファイル&メディア** (画像/音楽ファイル) - ファイル型
- **テキスト 1** (タグ) - リッチテキスト型（推奨：マルチセレクト型に変更）
- **日付** (作成日) - 日付型

### データベースをIntegrationに接続:
1. データベースページの右上「...」→「Add connections」
2. 作成したIntegrationを選択

## 3. 環境変数を設定

`.env.local` ファイルを編集：

```env
NOTION_API_KEY=your_integration_token_here
NOTION_DATABASE_ID=your_database_id_here
```

### データベースIDの取得方法:
NotionデータベースのURLから取得：
`https://notion.so/your-workspace/DATABASE_ID?v=...`

## 4. データの追加方法

1. Notionデータベースに新しい行を追加
2. 各プロパティを入力：
   - **名前**: 作品名
   - **テキスト**: 作品の説明
   - **選択**: Music/Illustration/Doujinshi から選択（または 音楽/イラスト/同人誌）
   - **ファイル&メディア**: 画像ファイルや音楽ファイルをアップロード
   - **テキスト 1**: タグ（カンマ区切りで入力）
3. ウェブサイトを再読み込み（またはリビルド）

## 5. テスト用データの例

| 名前 | テキスト | 選択 | テキスト 1 |
|------|----------|------|-----------|
| 東方アレンジCD Vol.1 | オリジナルアレンジ楽曲集 | Music | アレンジ, CD |
| 霊夢イラスト | 博麗霊夢のファンアート | Illustration | 霊夢, ファンアート |
| 東方考察誌 第1号 | 設定資料集 | Doujinshi | 考察, 設定 |

## 注意事項

- Notion APIは無料プランでも使用可能
- データの更新は手動でのリビルドが必要（自動更新はデプロイ時の設定次第）
- 画像URLは一定期間で期限切れになる場合があります
