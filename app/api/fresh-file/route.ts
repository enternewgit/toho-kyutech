import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageId = searchParams.get('pageId');
  const fileType = searchParams.get('type') || 'file';

  if (!pageId) {
    return NextResponse.json({ error: 'PageId parameter is required' }, { status: 400 });
  }

  try {
    console.log('Fetching fresh file URL for page:', pageId);

    // ページの詳細を取得
    const page = await notion.pages.retrieve({ page_id: pageId });
    const properties = (page as any).properties;

    // プロパティからファイルURLを取得
    let fileUrl = properties['ファイル&メディア']?.files?.[0]?.file?.url || 
                 properties['ファイル&メディア']?.files?.[0]?.external?.url;

    // ファイルが見つからない場合はブロック内を検索
    if (!fileUrl) {
      const pageBlocks = await notion.blocks.children.list({
        block_id: pageId,
      });
      
      for (const block of pageBlocks.results) {
        const blockData = block as any;
        if (fileType === 'image' && blockData.type === 'image' && blockData.image?.file?.url) {
          fileUrl = blockData.image.file.url;
          break;
        } else if (fileType === 'audio' && blockData.type === 'audio' && blockData.audio?.file?.url) {
          fileUrl = blockData.audio.file.url;
          break;
        } else if (fileType === 'file' && (blockData.type === 'image' || blockData.type === 'audio')) {
          fileUrl = blockData[blockData.type]?.file?.url;
          if (fileUrl) break;
        }
      }
    }

    if (!fileUrl) {
      console.error('No file found for page:', pageId);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    console.log('Found fresh file URL:', fileUrl);

    // ファイル拡張子からMIMEタイプを推測
    const getContentType = (url: string) => {
      const lowerUrl = url.toLowerCase();
      if (lowerUrl.includes('.mp3')) return 'audio/mpeg';
      if (lowerUrl.includes('.wav')) return 'audio/wav';
      if (lowerUrl.includes('.ogg')) return 'audio/ogg';
      if (lowerUrl.includes('.m4a')) return 'audio/mp4';
      if (lowerUrl.includes('.aac')) return 'audio/aac';
      if (lowerUrl.includes('.png')) return 'image/png';
      if (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg')) return 'image/jpeg';
      if (lowerUrl.includes('.gif')) return 'image/gif';
      if (lowerUrl.includes('.webp')) return 'image/webp';
      return 'application/octet-stream';
    };

    // ファイルを取得してプロキシ
    const response = await fetch(fileUrl, {
      headers: {
        'User-Agent': 'toho-kyutech-website/1.0',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch file:', response.status, response.statusText);
      return NextResponse.json({ 
        error: 'Failed to fetch file',
        status: response.status,
        statusText: response.statusText,
        fileUrl
      }, { status: response.status });
    }

    const contentType = getContentType(fileUrl);
    const data = await response.arrayBuffer();

    console.log('Fresh file proxied successfully:', {
      pageId,
      fileUrl,
      contentType,
      size: data.byteLength
    });

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': data.byteLength.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'private, max-age=300', // 5分のみキャッシュ
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type, Range',
        'X-Content-Type-Options': 'nosniff',
        'Content-Disposition': 'inline',
      },
    });
  } catch (error) {
    console.error('Error fetching fresh file:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
