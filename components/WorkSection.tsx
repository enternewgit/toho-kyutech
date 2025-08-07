"use client";

import Image from 'next/image';
import { WorkItem } from '@/lib/notion';
import { useState } from 'react';

interface WorkCardProps {
  work: WorkItem;
}

// 画像ファイルかどうかを判定する関数
function isImageFile(url?: string): boolean {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
  return imageExtensions.some(ext => url.toLowerCase().includes(ext));
}

// 音楽ファイルかどうかを判定する関数
function isAudioFile(url?: string): boolean {
  if (!url) return false;
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
  return audioExtensions.some(ext => url.toLowerCase().includes(ext));
}

export function WorkCard({ work }: WorkCardProps) {
  const [imageError, setImageError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const showImage = work.imageUrl && isImageFile(work.imageUrl) && !imageError;
  const isAudio = work.imageUrl && isAudioFile(work.imageUrl);

  // プロキシURL経由でファイルにアクセス
  const getProxyUrl = (originalUrl: string) => {
    if (originalUrl.includes('amazonaws.com') || originalUrl.includes('notion')) {
      return `/api/proxy-file?url=${encodeURIComponent(originalUrl)}`;
    }
    return originalUrl;
  };

  const handleImageError = (error: any) => {
    console.error('Image load error for:', work.title);
    console.error('Image URL:', work.imageUrl);
    console.error('Error details:', error);
    setImageError(true);
    setErrorDetails(`読み込み失敗: ${work.imageUrl?.substring(0, 50)}...`);
  };

  // デバッグ用：コンポーネントの状態をログ出力
  console.log('WorkCard render:', {
    title: work.title,
    hasImageUrl: !!work.imageUrl,
    imageUrl: work.imageUrl,
    proxyUrl: work.imageUrl ? getProxyUrl(work.imageUrl) : null,
    isImage: isImageFile(work.imageUrl),
    isAudio: isAudioFile(work.imageUrl),
    imageError
  });

  return (
    <div className="border rounded-lg p-3 md:p-4 bg-white/90 hover:bg-white/95 transition-colors">
      {showImage && (
        <div className="relative h-24 md:h-32 mb-3 rounded overflow-hidden">
          {/* Next.js Image コンポーネントを試す */}
          <Image
            src={getProxyUrl(work.imageUrl!)}
            alt={work.title}
            fill
            className="object-cover"
            onError={handleImageError}
            unoptimized={true}
          />
        </div>
      )}
      
      {/* 画像エラーの場合は通常のimgタグで再試行 */}
      {imageError && work.imageUrl && isImageFile(work.imageUrl) && (
        <div className="h-24 md:h-32 mb-3 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src={getProxyUrl(work.imageUrl)}
            alt={work.title}
            className="max-h-full max-w-full object-cover"
            onError={() => console.log('img tag also failed')}
          />
        </div>
      )}
      
      {/* 音楽ファイルの場合は音符アイコンと再生ボタンを表示 */}
      {isAudio && (
        <div className="h-auto mb-3 rounded bg-gradient-to-br from-blue-100 to-purple-100 p-3">
          <div className="text-center mb-2">
            <div className="text-2xl md:text-4xl mb-1">🎵</div>
            <div className="text-xs md:text-sm text-gray-600">音楽ファイル</div>
            <div className="text-sm font-medium text-gray-800 mt-1">{work.title}</div>
          </div>
          <audio 
            controls 
            className="w-full text-sm"
            preload="metadata"
            controlsList="nodownload"
            style={{ maxHeight: '40px' }}
          >
            <source src={getProxyUrl(work.imageUrl!)} type="audio/mpeg" />
            <source src={getProxyUrl(work.imageUrl!)} type="audio/mp3" />
            <source src={getProxyUrl(work.imageUrl!)} type="audio/wav" />
            お使いのブラウザは音声ファイルをサポートしていません。
          </audio>
        </div>
      )}
      
      {/* 画像読み込みエラーまたはファイルがない場合 */}
      {(!showImage && !isAudio) && (
        <div className="h-24 md:h-32 mb-3 rounded bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            {work.category === 'music' && <div className="text-2xl md:text-4xl mb-1 md:mb-2">🎵</div>}
            {work.category === 'illustration' && <div className="text-2xl md:text-4xl mb-1 md:mb-2">🎨</div>}
            {work.category === 'doujinshi' && <div className="text-2xl md:text-4xl mb-1 md:mb-2">📚</div>}
            <div className="text-xs md:text-sm text-gray-600">
              {work.category === 'music' && '音楽作品'}
              {work.category === 'illustration' && 'イラスト作品'}
              {work.category === 'doujinshi' && '同人誌'}
            </div>
            {imageError && (
              <div className="text-xs text-red-500 mt-1">
                画像読み込みエラー
              </div>
            )}
          </div>
        </div>
      )}
      
      <h3 className="font-bold mb-2 text-sm md:text-base text-gray-800 line-clamp-2">{work.title}</h3>
      <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-3">{work.description}</p>
      
      {work.tags && work.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {work.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-2">
        {new Date(work.createdAt).toLocaleDateString('ja-JP')}
      </div>
    </div>
  );
}

interface WorkSectionProps {
  title: string;
  emoji: string;
  works: WorkItem[];
  columns?: number;
}

export function WorkSection({ title, emoji, works, columns = 3 }: WorkSectionProps) {
  // レスポンシブなグリッドレイアウト設定
  const getGridCols = (baseColumns: number) => {
    switch (baseColumns) {
      case 1:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 2:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  if (works.length === 0) {
    return (
      <section className="bg-white/80 rounded-lg p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4">{emoji} {title}</h2>
        <p className="text-gray-500">まだ作品がありません。</p>
      </section>
    );
  }

  return (
    <section className="bg-white/80 rounded-lg p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4">{emoji} {title}</h2>
      <div className={`grid ${getGridCols(columns)} gap-3 md:gap-4`}>
        {works.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </div>
    </section>
  );
}
