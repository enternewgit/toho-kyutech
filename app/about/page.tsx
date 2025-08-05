export default function About() {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">サークル紹介</h1>
        <p className="text-lg text-gray-600">東方求徹区について</p>
      </div>
      
      <div className="space-y-6">
        <section className="bg-white/80 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">東方求徹区について</h2>
          <p className="text-gray-700 leading-relaxed">
            東方求徹区は九州工業大学の大学東方サークルです。
            東方Projectの音楽、ゲーム、二次創作などを愛する学生たちが集まり、
            様々な活動を行っています。
          </p>
        </section>

        <section className="bg-white/80 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">活動内容</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>定期的な部会</li>
            <li>例大祭などの同人誌即売会への参加</li>
            <li>東方アレンジCD・同人誌の制作</li>
            <li>東方ゲームの対戦会</li>
            <li>学園祭での展示</li>
          </ul>
        </section>

        <section className="bg-white/80 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">入部について</h2>
          <p className="text-gray-700 leading-relaxed">
            東方Projectに興味がある九州工業大学の学生なら誰でも歓迎です！
            初心者の方も大歓迎。一緒に東方の世界を楽しみましょう。
          </p>
        </section>
      </div>
    </div>
  );
}
