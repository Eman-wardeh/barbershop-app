// 
import { NextResponse } from 'next/server'

export function middleware(req) {
    const path = req.nextUrl.pathname;

    const isPublicPath =
        path === '/login' ||
        path === '/signup' ||
        path === '/verifyemail';

    const token = req.cookies.get('jwt')?.value;

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ]
}