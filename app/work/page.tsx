import { getWorksFromNotion, categorizeWorks, debugNotionDatabase } from '@/lib/notion';
import { WorkSection } from '@/components/WorkSection';

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
