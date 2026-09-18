import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // 1. 로컬 개발 환경(localhost)에서는 차단하지 않고 자유롭게 작업 가능하도록 통과
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // 2. Vercel 환경변수에서 허용 IP 목록 가져오기
  const allowedIpsEnv = process.env.ALLOWED_IPS || '';
  const allowedIps = allowedIpsEnv
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean);

  // 환경변수가 비어있다면 실수로 전면 차단되는 문제를 막기 위해 통과
  if (allowedIps.length === 0) {
    return NextResponse.next();
  }

  // 3. Vercel 프록시 헤더에서 클라이언트 공인 IP 추출
  const forwardedFor = req.headers.get('x-forwarded-for');
  const clientIp = forwardedFor
    ? forwardedFor.split(',')[0].trim()
    : req.headers.get('x-real-ip') || '';

  // 4. 인가된 IP인지 검사
  const isAllowed = allowedIps.includes(clientIp);

  if (!isAllowed) {
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>접근 제한 (Access Denied)</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background-color: #f8fafc;
      color: #1e293b;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: #ffffff;
      padding: 2.5rem;
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
      text-align: center;
      max-width: 440px;
      width: 100%;
      border: 1px solid #e2e8f0;
    }
    .icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    h1 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ef4444;
      margin: 0 0 0.75rem 0;
    }
    p {
      font-size: 0.95rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0 0 1.25rem 0;
    }
    .ip-box {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      background: #f1f5f9;
      color: #334155;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      display: inline-block;
      margin-bottom: 1.25rem;
      word-break: break-all;
    }
    .footer {
      font-size: 0.8rem;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
      padding-top: 1rem;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🔒</div>
    <h1>접근 권한이 없습니다</h1>
    <p>본 프로토타입은 인가된 IP 대역에서만 접속 가능하도록 보호되어 있습니다.</p>
    <div>현재 접속 IP</div>
    <div class="ip-box">${clientIp || 'IP 확인 불가'}</div>
    <p class="footer">접속 권한이 필요하신 경우 담당자에게 문의해 주세요.</p>
  </div>
</body>
</html>`,
      {
        status: 403,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      }
    );
  }

  return NextResponse.next();
}

// 이미지, 폰트, CSS/JS 등 정적 리소스는 검사에서 제외하고 웹페이지 라우트에만 적용
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
  ],
};
