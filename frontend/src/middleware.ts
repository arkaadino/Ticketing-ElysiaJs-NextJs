import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const url = req.nextUrl.pathname;
    const token = req.cookies.get('token')?.value;

    // Biarkan user mengakses halaman auth tanpa token
    if (url.startsWith('/signin')) {
        return NextResponse.next();
    }

    // Kalau gak ada token, redirect ke login
    if (!token) {
        return NextResponse.redirect(new URL('/signin', req.url));
    }

    return NextResponse.next();
}

// Middleware hanya jalan di halaman selain auth
export const config = {
    matcher: ['/((?!_next/static|_next/image|images|signin).*)'],
};