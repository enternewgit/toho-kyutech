# Vercelデプロイ用環境変数設定

以下の環境変数をVercelの設定画面で追加してください：

## 必須環境変数

### Notion API設定
```
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_works_database_id_here
NOTION_ACTIVITIES_DATABASE_ID=your_activities_database_id_here
```

## Vercelでの設定手順

1. Vercelダッシュボードでプロジェクトを選択
2. Settings → Environment Variables
3. 上記の変数を一つずつ追加（実際の値を入力）
4. Environment: Production, Preview, Development すべてにチェック
5. Deployments → Redeploy で再デプロイ

## 注意事項

- これらの値は機密情報です
- GitHubリポジトリには絶対にコミットしないでください
- 本番環境でのみ使用してください
