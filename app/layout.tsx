import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";

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
        <header className = "bg-blue-600 text-white p-4">
          <h1 className = "text-2xl font-bold">東方求徹区</h1>
          {/*ナビゲーションなどをここに追加*/}
          <nav>
            <ul className = "flex space-x-4">
              <li><a href = "/" className="hover:underline">ホーム</a></li>
              <li><a href = "/about" className="hover:underline">サークル紹介</a></li>
              <li><a href = "/work" className = "hover:underline">作品ギャラリー</a></li>
              {/*他のページのリンク*/}
            </ul>
          </nav>
        </header>

        <main className="container mx-auto p-4">
          {children}{/*ここに各ページのコンテンツが表示される*/}
        </main>

        <footer className="bg-gray-800 text-white p-4 text-center mt-8">
          &copy; {new Date().getFullYear()}東方求徹区 All rights reserved.
        </footer>
      </body>
    </html>
  );
}