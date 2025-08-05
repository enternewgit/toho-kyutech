import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export interface ActivityItem {
  id: string;
  title: string;
  date: string;
  type: string;
  description: string;
  imageUrl?: string;
  link?: string;
}

// 活動記録データベースから活動データを取得
export async function getActivitiesFromNotion(): Promise<ActivityItem[]> {
  if (!process.env.NOTION_ACTIVITIES_DATABASE_ID) {
    return getFallbackActivities();
  }

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_ACTIVITIES_DATABASE_ID,
    });

    const activities: ActivityItem[] = response.results.map((page: any) => {
      const properties = page.properties;
      
      // 複数のプロパティ名を試す
      const titleProperty = properties['名前'] || properties['Name'] || properties['タイトル'] || properties['Title'];
      const dateProperty = properties['日付'] || properties['Date'] || properties['いつ'] || properties['When'];
      const typeProperty = properties['種類'] || properties['Type'] || properties['カテゴリ'] || properties['Category'];
      const descProperty = properties['説明'] || properties['Description'] || properties['詳細'] || properties['Details'];
      
      return {
        id: page.id,
        title: titleProperty?.title?.[0]?.plain_text || 'Untitled',
        date: dateProperty?.date?.start || '',
        type: typeProperty?.select?.name || 'その他',
        description: descProperty?.rich_text?.[0]?.plain_text || '',
        imageUrl: properties['画像']?.files?.[0]?.file?.url || properties['画像']?.files?.[0]?.external?.url,
        link: properties['リンク']?.url || '',
      };
    });

    // 日付でソート（JavaScriptレベルで実行）
    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    return getFallbackActivities();
  }
}

// フォールバック用の静的データ
function getFallbackActivities(): ActivityItem[] {
  return [
    {
      id: 'fallback-1',
      title: 'サークル結成＆公式Twitter始動',
      date: '2020-11-12',
      type: 'その他',
      description: '東方求徹区サークル設立。公式Twitterアカウント開設。',
    },
    {
      id: 'fallback-2',
      title: 'サークルHP作製開始',
      date: '2021-08-30',
      type: '技術',
      description: 'サークル公式ウェブサイトの制作を開始。',
    },
    {
      id: 'fallback-3',
      title: '第61回工大祭展示参加',
      date: '2021-11-20',
      type: 'イベント',
      description: '九州工業大学学園祭にて展示ブースで参加。2日間開催。',
    },
    {
      id: 'fallback-4',
      title: '第十九回博麗神社例大祭参加',
      date: '2022-05-08',
      type: 'イベント',
      description: '東方Project最大の同人即売会にサークル参加。',
    },
    {
      id: 'fallback-5',
      title: '第62回工大祭展示参加',
      date: '2022-10-08',
      type: 'イベント',
      description: '九州工業大学学園祭にて展示ブースで参加。2日間開催。',
    },
    {
      id: 'fallback-6',
      title: '第18回東方紅楼夢参加',
      date: '2022-10-09',
      type: 'イベント',
      description: '関西最大の東方オンリーイベントにサークル参加。',
    },
    {
      id: 'fallback-7',
      title: '第二十回博麗神社例大祭参加',
      date: '2023-05-07',
      type: 'イベント',
      description: '東方Project最大の同人即売会にサークル参加。',
    },
    {
      id: 'fallback-8',
      title: '第63回工大祭展示参加',
      date: '2023-10-07',
      type: 'イベント',
      description: '九州工業大学学園祭にて展示ブースで参加。2日間開催。',
    },
    {
      id: 'fallback-9',
      title: '第二十一回博麗神社例大祭参加',
      date: '2024-05-03',
      type: 'イベント',
      description: '東方Project最大の同人即売会にサークル参加。',
    },
    {
      id: 'fallback-10',
      title: '九州東方サークル交流会',
      date: '2024-06-16',
      type: 'イベント',
      description: 'げそ研、姫山伝、鹿児島大東方サークルとの合同交流会を実施。',
    },
    {
      id: 'fallback-11',
      title: '第64回工大祭展示参加',
      date: '2024-10-12',
      type: 'イベント',
      description: '九州工業大学学園祭にて展示ブースで参加。2日間開催。',
    },
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // 新しい順にソート
}
