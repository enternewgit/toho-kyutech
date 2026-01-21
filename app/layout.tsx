import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Serif_JP } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Image from "next/image";



const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: '東方求徹区 | 九州工業大学 東方Projectサークル',
    template: '%s | 東方求徹区'
  },
  description: '東方求徹区は九州工業大学の東方Projectサークルです。東方の音楽、ゲーム、二次創作を楽しむ学生たちが集まり、例大祭への参加や同人誌制作などの活動を行っています。',
  keywords: ['東方求徹区', '東方Project', '九州工業大学', '大学サークル', '同人サークル', '例大祭', '東方アレンジ', '同人誌', '九工大', 'きゅーてっく', '東方', 'Touhou Project'],
  authors: [{ name: '東方求徹区' }],
  creator: '東方求徹区',
  publisher: '東方求徹区',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://toho-kyutech.vercel.app/',
    siteName: '東方求徹区',
    title: '東方求徹区 | 九州工業大学 東方Projectサークル',
    description: '東方求徹区は九州工業大学の東方Projectサークルです。東方の音楽、ゲーム、二次創作を楽しむ学生たちが集まり、例大祭への参加や同人誌制作などの活動を行っています。',
    images: [
      {
        url: '/images/icon.jpg',
        width: 1200,
        height: 630,
        alt: '東方求徹区',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Kyutech_Touhou',
    creator: '@Kyutech_Touhou',
    title: '東方求徹区 | 九州工業大学 東方Projectサークル',
    description: '東方求徹区は九州工業大学の東方Projectサークルです。東方の音楽、ゲーム、二次創作を楽しむ学生たちが集まり、例大祭への参加や同人誌制作などの活動を行っています。',
    images: ['/images/icon.jpg'],
  },
  icons: {
    icon: '/images/icon.jpg',
    apple: '/images/icon.jpg',
  },
  verification: {
    // Google Search Console の確認コードをここに追加（取得後）
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '東方求徹区',
    alternateName: ['Toho Kyutech', '東方きゅーてっく'],
    url: 'https://toho-kyutech.vercel.app',
    logo: 'https://toho-kyutech.vercel.app/images/icon.jpg',
    description: '九州工業大学の東方Projectサークル',
    foundingDate: '2010',
    sameAs: [
      'https://twitter.com/Kyutech_Touhou',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: '北九州市',
      addressRegion: '福岡県',
      addressCountry: 'JP',
    },
    parentOrganization: {
      '@type': 'EducationalOrganization',
      name: '九州工業大学',
    },
  };

  return (
    <html lang ="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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