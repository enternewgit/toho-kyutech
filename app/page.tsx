import Script from 'next/script';
import { getActivitiesFromNotion } from '@/lib/activities';
import { ActivityTimeline } from '@/components/ActivityTimeline';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '東方求徹区 | 九州工業大学 東方Projectサークル',
  description: '九州工業大学の東方Projectサークル「東方求徹区」の公式ホームページです。例大祭への参加、東方アレンジCD・同人誌の制作、ゲーム対戦会など、東方を楽しむ活動を行っています。',
  openGraph: {
    title: '東方求徹区 | 九州工業大学 東方Projectサークル',
    description: '九州工業大学の東方Projectサークル「東方求徹区」の公式ホームページです。例大祭への参加、東方アレンジCD・同人誌の制作、ゲーム対戦会など、東方を楽しむ活動を行っています。',
  },
};

export default async function Home(){
  // 活動記録データを取得
  const activities = await getActivitiesFromNotion();

  return(
    <div>
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold">東方求徹区へようこそ！</h1>
        <p className="text-base md:text-lg">九州工業大学の東方Projectサークルです</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        {/* 上部/左側：Twitterタイムライン */}
        <div className="w-full lg:w-1/3 lg:pr-4">
          <h2 className="text-xl font-bold mb-3 lg:hidden">Twitter</h2>
          <a className="twitter-timeline" 
             data-width="100%"
             data-height="400"
             href="https://twitter.com/Kyutech_Touhou?ref_src=twsrc%5Etfw">
            Tweets by Kyutech_Touhou
          </a>
          <Script 
            src="https://platform.twitter.com/widgets.js" 
            strategy="lazyOnload"
            charSet="utf-8"
          />
        </div>
        
        {/* 下部/中央：活動記録 */}
        <div className="w-full lg:w-1/3 lg:px-4">
          <h2 className="text-xl md:text-2xl font-bold mb-4">活動記録</h2>
          <div className="h-80 md:h-96 overflow-y-auto bg-white/80 p-3 md:p-4 rounded-lg">
            <ActivityTimeline activities={activities} compact={true} />
          </div>
        </div>
        
        {/* 右側：空きスペース（デスクトップのみ表示） */}
        <div className="w-full lg:w-1/3 lg:pl-4 hidden lg:block">
          {/* ここに必要に応じて他のコンテンツを追加 */}
        </div>
      </div>
    </div>
  )
}