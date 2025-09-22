import { NextRequest, NextResponse } from 'next/server';

function getBackendUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;
}

async function proxy(request: NextRequest) {
  const configuredBackend = getBackendUrl();

  if (!configuredBackend) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_BACKEND_URL not set' }, { status: 500 });
  }

  const { pathname, searchParams } = new URL(request.url);
  const targetUrl = (() => {
    // Allow temporary override via query param for debugging
    const override = searchParams.get('backend');
    const base = override || configuredBackend;
    const baseStripped = (base || '').replace(/\/$/, '');
    const path = pathname.replace(/^\/api\/backend/, '');
    const query = (() => {
      const sp = new URLSearchParams(searchParams);
      sp.delete('backend');
      const s = sp.toString();
      return s ? `?${s}` : '';
    })();
    return `${baseStripped}${path}${query}`;
  })();

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.set('x-forwarded-by', 'frontend-proxy');

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'manual'
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      init.body = JSON.stringify(body);
    } else if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      init.body = form as any;
    } else {
      const text = await request.text();
      init.body = text;
    }
  }

  const response = await fetch(targetUrl, init);

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete('content-security-policy');
  responseHeaders.set('x-proxied-by', 'frontend-proxy');
  responseHeaders.set('x-backend-configured', configuredBackend ? 'true' : 'false');

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await response.json();
    return NextResponse.json(data, { status: response.status, headers: responseHeaders });
  }

  const buffer = await response.arrayBuffer();
  return new NextResponse(buffer, { status: response.status, headers: responseHeaders });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
export const OPTIONS = proxy;


