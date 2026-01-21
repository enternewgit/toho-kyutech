import { getWorksFromNotion, categorizeWorks, debugNotionDatabase } from '@/lib/notion';
import { WorkSection } from '@/components/WorkSection';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '作品ギャラリー',
  description: '東方求徹区メンバーの創作作品を紹介します。東方アレンジ音楽、イラスト、同人誌など、さまざまな二次創作作品をご覧いただけます。',
  openGraph: {
    title: '作品ギャラリー | 東方求徹区',
    description: '東方求徹区メンバーの創作作品を紹介します。東方アレンジ音楽、イラスト、同人誌など、さまざまな二次創作作品をご覧いただけます。',
  },
};

export default async function Work() {
  // Notionから作品データを取得
  const works = await getWorksFromNotion();
  const categorizedWorks = categorizeWorks(works);

  return (
    <div>
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">作品ギャラリー</h1>
        <p className="text-base md:text-lg text-gray-600">メンバーの創作作品を紹介</p>
      </div>
      
      <div className="space-y-6 md:space-y-8">
        <WorkSection
          title="音楽作品"
          emoji="🎼"
          works={categorizedWorks.music}
          columns={1} // モバイルでは1列、デスクトップでは調整
        />
        
        <WorkSection
          title="イラスト作品"
          emoji="🎨"
          works={categorizedWorks.illustration}
          columns={2} // モバイルでは2列、デスクトップでは調整
        />
        
        <WorkSection
          title="同人誌"
          emoji="📚"
          works={categorizedWorks.doujinshi}
          columns={1} // モバイルでは1列
        />
      </div>
    </div>
  );
}
