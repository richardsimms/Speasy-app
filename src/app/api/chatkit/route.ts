import type { NextRequest } from 'next/server';

import { Env } from '@/libs/Env';

const CHATKIT_SERVER_URL = Env.CHATKIT_SERVER_URL || 'http://localhost:8000/chatkit';

export async function POST(req: NextRequest) {
  const body = await req.text();

  try {
    const response = await fetch(CHATKIT_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    // Check if it's a streaming response
    const contentType = response.headers.get('Content-Type') || 'application/json';

    if (contentType.includes('text/event-stream')) {
      // Forward SSE stream
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Forward JSON response
    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('ChatKit proxy error:', error);
    return Response.json(
      { error: 'Failed to connect to ChatKit server' },
      { status: 502 },
    );
  }
}

export async function GET() {
  return Response.json({
    status: 'healthy',
    service: 'chatkit-proxy',
  });
}
