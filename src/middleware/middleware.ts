// middleware.ts (สำหรับ Next.js 16)
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/admin/dashboard', '/admin/users', '/admin/staff'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ตรวจสอบ protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = request.cookies.get('accessToken')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // ถ้า user พยายาม access login page ขณะ authenticated
  if (pathname === '/admin/login') {
    const token = request.cookies.get('accessToken')?.value;
    if (token) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};