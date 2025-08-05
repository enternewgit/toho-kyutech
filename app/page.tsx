import Script from 'next/script';
import { getActivitiesFromNotion } from '@/lib/activities';
import { ActivityTimeline } from '@/components/ActivityTimeline';

export default async function Home(){
  // 活動記録データを取得
  const activities = await getActivitiesFromNotion();

  return(
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">東方求徹区へようこそ！</h1>
        <p className="text-lg">九州工業大学の東方Projectサークルです</p>
      </div>
      
      <div className="flex gap-6">
        {/* 左側：Twitterタイムライン */}
        <div className="w-1/3 pr-4">
          <a className="twitter-timeline" 
             data-width="300"
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
        
        {/* 中央：活動記録 */}
        <div className="w-1/3 px-4">
          <h2 className="text-2xl font-bold mb-4">活動記録</h2>
          <div className="h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg">
            <ActivityTimeline activities={activities} compact={true} />
          </div>
        </div>
        
        {/* 右側：空きスペース（将来的に他のコンテンツ用） */}
        <div className="w-1/3 pl-4">
          {/* ここに必要に応じて他のコンテンツを追加 */}
        </div>
      </div>
    </div>
  )
}