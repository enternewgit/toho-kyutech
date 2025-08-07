import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileUrl = searchParams.get('url');

  if (!fileUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    console.log('Proxying file:', fileUrl);
    
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
        statusText: response.statusText
      }, { status: response.status });
    }

    // ファイル拡張子からMIMEタイプを推測
    const getContentType = (url: string, fallbackType: string) => {
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
      return fallbackType;
    };

    const originalContentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentType = getContentType(fileUrl, originalContentType);
    const data = await response.arrayBuffer();

    console.log('File proxied successfully:', {
      url: fileUrl,
      originalContentType,
      finalContentType: contentType,
      size: data.byteLength
    });

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': data.byteLength.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type, Range',
        // ライブストリーム表示を防ぐためのヘッダー
        'X-Content-Type-Options': 'nosniff',
        'Content-Disposition': 'inline',
      },
    });
  } catch (error) {
    console.error('Error proxying file:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
