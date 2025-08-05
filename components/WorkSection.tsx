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

  const handleImageError = (error: any) => {
    console.error('Image load error for:', work.title, work.imageUrl);
    console.error('Error details:', error);
    setImageError(true);
    setErrorDetails('読み込み失敗');
  };

  return (
    <div className="border rounded-lg p-4 bg-white/90 hover:bg-white/95 transition-colors">
      {showImage && (
        <div className="relative h-32 mb-3 rounded overflow-hidden">
          {/* Next.js Image コンポーネントを試す */}
          <Image
            src={work.imageUrl!}
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
        <div className="h-32 mb-3 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src={work.imageUrl}
            alt={work.title}
            className="max-h-full max-w-full object-cover"
            onError={() => console.log('img tag also failed')}
          />
        </div>
      )}
      
      {/* 音楽ファイルの場合は音符アイコンと再生ボタンを表示 */}
      {isAudio && (
        <div className="h-32 mb-3 rounded bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center">
          <div className="text-4xl mb-2">🎵</div>
          <div className="text-sm text-gray-600 mb-2">音楽ファイル</div>
          <audio controls className="w-full max-w-xs">
            <source src={work.imageUrl} type="audio/mpeg" />
            お使いのブラウザは音声ファイルをサポートしていません。
          </audio>
        </div>
      )}
      
      {/* 画像読み込みエラーまたはファイルがない場合 */}
      {(!showImage && !isAudio) && (
        <div className="h-32 mb-3 rounded bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            {work.category === 'music' && <div className="text-4xl mb-2">🎵</div>}
            {work.category === 'illustration' && <div className="text-4xl mb-2">🎨</div>}
            {work.category === 'doujinshi' && <div className="text-4xl mb-2">📚</div>}
            <div className="text-sm text-gray-600">
              {work.category === 'music' && '音楽作品'}
              {work.category === 'illustration' && 'イラスト作品'}
              {work.category === 'doujinshi' && '同人誌'}
            </div>
            {imageError && (
              <div className="text-xs text-red-500 mt-1">
                画像読み込みエラー: {errorDetails}
              </div>
            )}
          </div>
        </div>
      )}
      
      <h3 className="font-bold mb-2 text-gray-800">{work.title}</h3>
      <p className="text-sm text-gray-600 mb-3">{work.description}</p>
      
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
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  if (works.length === 0) {
    return (
      <section className="bg-white/80 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{emoji} {title}</h2>
        <p className="text-gray-500">まだ作品がありません。</p>
      </section>
    );
  }

  return (
    <section className="bg-white/80 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{emoji} {title}</h2>
      <div className={`grid grid-cols-1 ${gridCols[columns as keyof typeof gridCols]} gap-4`}>
        {works.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </div>
    </section>
  );
}
