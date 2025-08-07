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

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const data = await response.arrayBuffer();

    console.log('File proxied successfully:', {
      url: fileUrl,
      contentType,
      size: data.byteLength
    });

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
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
