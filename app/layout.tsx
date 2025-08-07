import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_JP } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Image from "next/image";

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata = {
  title:'東方求徹区',
  description: '東方求徹区の公式ホームページです。'
};

export default function RootLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  return (
    <html lang ="ja">
      <body>
        <header className = "fixed top-0 left-0 w-full bg-blue-900 text-white p-4 z-50">
          <div className="flex items-center justify-between">
            <h1 className={`text-xl md:text-2xl font-bold ${notoSerifJP.className}`}>東方求徹区</h1>
            <nav>
              <ul className = "flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 text-sm md:text-base">
                <li><Link href="/" className="hover:underline">ホーム</Link></li>
                <li><Link href="/about" className="hover:underline whitespace-nowrap">サークル紹介</Link></li>
                <li><Link href="/work" className="hover:underline whitespace-nowrap">作品ギャラリー</Link></li>
                {/*他のページのリンク*/}
              </ul>
            </nav>
          </div>
        </header>

        <main className="container mx-auto p-2 md:p-4 min-h-screen bg-cover bg-center bg-no-repeat pt-20 md:pt-24" 
              style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(/images/icon.jpg)', 
                backgroundAttachment: 'scroll',
                backgroundSize: 'cover'
              }}>
          <div className="p-2 md:p-6">
            {children}{/*ここに各ページのコンテンツが表示される*/}
          </div>
        </main>

        <footer className="bg-gray-800 text-white p-4 text-center mt-8">
          &copy; {new Date().getFullYear()}東方求徹区 All rights reserved.
        </footer>
      </body>
    </html>
  );
}