import { Client } from '@notionhq/client';

// Notion クライアントの初期化
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  category: 'music' | 'illustration' | 'doujinshi';
  imageUrl?: string;
  pageId: string; // NotionページIDを追加
  tags?: string[];
  createdAt: string;
}

// デバッグ用：データベースの構造を確認
export async function debugNotionDatabase() {
  if (!process.env.NOTION_DATABASE_ID) {
    console.error('NOTION_DATABASE_ID is not set');
    return;
  }

  try {
    const response = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID,
    });
    
    console.log('Database properties:', Object.keys(response.properties));
    return response.properties;
  } catch (error) {
    console.error('Error retrieving database info:', error);
  }
}

// Notionデータベースから作品データを取得
export async function getWorksFromNotion(): Promise<WorkItem[]> {
  if (!process.env.NOTION_DATABASE_ID) {
    console.error('NOTION_DATABASE_ID is not set');
    return [];
  }

  try {
    console.log('Fetching from Notion database:', process.env.NOTION_DATABASE_ID);
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      sorts: [
        {
          property: '日付',
          direction: 'descending',
        },
      ],
    });

    console.log('Notion response received, results count:', response.results.length);

    const works: WorkItem[] = [];
    
    for (const page of response.results) {
      const properties = (page as any).properties;
      
      // カテゴリのマッピングを改善
      const rawCategory = properties['選択']?.select?.name;
      let category: 'music' | 'illustration' | 'doujinshi' = 'music';
      if (rawCategory) {
        const lowerCategory = rawCategory.toLowerCase();
        if (lowerCategory.includes('illustration') || lowerCategory.includes('イラスト')) {
          category = 'illustration';
        } else if (lowerCategory.includes('doujinshi') || lowerCategory.includes('同人誌')) {
          category = 'doujinshi';
        } else if (lowerCategory.includes('music') || lowerCategory.includes('音楽')) {
          category = 'music';
        }
      }

      // ファイルURLを取得（改良版）
      let fileUrl = properties['ファイル&メディア']?.files?.[0]?.file?.url || 
                   properties['ファイル&メディア']?.files?.[0]?.external?.url;

      // ページの詳細内容も取得してファイルを探す（必要な場合）
      if (!fileUrl) {
        try {
          const pageBlocks = await notion.blocks.children.list({
            block_id: (page as any).id,
          });
          
          // ブロック内のファイルを探す
          for (const block of pageBlocks.results) {
            const blockData = block as any;
            if (blockData.type === 'image' && blockData.image?.file?.url) {
              fileUrl = blockData.image.file.url;
              console.log('Found image in blocks for:', properties['名前']?.title?.[0]?.plain_text);
              break;
            } else if (blockData.type === 'audio' && blockData.audio?.file?.url) {
              fileUrl = blockData.audio.file.url;
              console.log('Found audio in blocks for:', properties['名前']?.title?.[0]?.plain_text);
              break;
            }
          }
        } catch (blockError) {
          console.error('Error fetching blocks for page:', (page as any).id, blockError);
        }
      }

      if (fileUrl) {
        console.log('File URL found for:', properties['名前']?.title?.[0]?.plain_text || 'Untitled', fileUrl);
      } else {
        console.log('No file URL for:', properties['名前']?.title?.[0]?.plain_text || 'Untitled');
      }
      
      works.push({
        id: (page as any).id,
        title: properties['名前']?.title?.[0]?.plain_text || 'Untitled',
        description: properties['テキスト']?.rich_text?.[0]?.plain_text || '',
        category,
        imageUrl: fileUrl,
        pageId: (page as any).id, // ページIDを保存
        tags: properties['テキスト 1']?.rich_text?.map((text: any) => text.plain_text) || [],
        createdAt: properties['日付']?.date?.start || (page as any).created_time,
      });
    }

    console.log('Processed works:', works.length);
    return works;
  } catch (error) {
    console.error('Error fetching from Notion:', error);
    // エラーの詳細を取得
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return [];
  }
}

// カテゴリ別に作品を分類
export function categorizeWorks(works: WorkItem[]) {
  return {
    music: works.filter(work => work.category === 'music'),
    illustration: works.filter(work => work.category === 'illustration'),
    doujinshi: works.filter(work => work.category === 'doujinshi'),
  };
}
