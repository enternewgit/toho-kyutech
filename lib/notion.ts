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
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      sorts: [
        {
          property: '日付',
          direction: 'descending',
        },
      ],
    });

    const works: WorkItem[] = response.results.map((page: any) => {
      const properties = page.properties;
      
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
      
      return {
        id: page.id,
        title: properties['名前']?.title?.[0]?.plain_text || 'Untitled',
        description: properties['テキスト']?.rich_text?.[0]?.plain_text || '',
        category,
        imageUrl: properties['ファイル&メディア']?.files?.[0]?.file?.url || properties['ファイル&メディア']?.files?.[0]?.external?.url,
        tags: properties['テキスト 1']?.rich_text?.map((text: any) => text.plain_text) || [],
        createdAt: properties['日付']?.date?.start || page.created_time,
      };
    });

    return works;
  } catch (error) {
    console.error('Error fetching from Notion:', error);
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
