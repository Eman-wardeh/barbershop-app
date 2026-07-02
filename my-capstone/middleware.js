import { NextResponse } from 'next/server'
 
export function middleware(req) {
    //create public path that allows user who is not signed up,
    //  or logged in to see only /login, /signup

    const path = req.nextUrl.pathname;  // <= how to get the current path
    const isPublicPath = 
        path === '/login' || path === '/signup' || path === '/verifyemail';

    const token = req.cookies.get('jwt')?.value || '';
    // If user is logged in and tries to access login/signup
    if(isPublicPath && token){
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    // If user is NOT logged in and tries to access protected pages
    if(!isPublicPath && !token){
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    return NextResponse.next()
}
export const config = {
    matcher: [
        "/admin/:path*",
        "/barber/:path*",
        "/dashboard/:path*",
        "/barberWorkingHours",
        "/barberTimeOff"
    ]
}