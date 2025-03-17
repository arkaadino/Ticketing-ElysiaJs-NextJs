import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.pathname;
    const accessToken = req.cookies.get('accessToken')?.value;
    const refreshToken = req.cookies.get('refreshToken')?.value;

    // 1️⃣ Check if backend is running
    try {
        const backendCheck = await fetch('http://localhost:5000', { method: 'GET' });
        if (!backendCheck.ok) {
            return NextResponse.redirect(new URL('/backend-offline', req.url));
        }
    } catch (error) {
        return NextResponse.redirect(new URL('/backend-offline', req.url));
    }

    // 2️⃣ Allow users to access signin page without tokens
    if (url.startsWith('/signin')) {
        return NextResponse.next();
    }

    // 3️⃣ If user has no tokens, redirect to login
    if (!accessToken && !refreshToken) {
        return NextResponse.redirect(new URL('/signin', req.url));
    }

    // 4️⃣ If access token is missing but refresh token exists, try to refresh
    if (!accessToken && refreshToken) {
        try {
            // Attempt to refresh the token
            const refreshResponse = await fetch('http://localhost:5000/auth/refresh', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Cookie: `refreshToken=${refreshToken}`
                }
            });

            // If refresh fails, redirect to login
            if (!refreshResponse.ok) {
                return NextResponse.redirect(new URL('/signin', req.url));
            }
        } catch (error) {
            // Error refreshing token, redirect to login
            return NextResponse.redirect(new URL('/signin', req.url));
        }
    }

    // 5️⃣ If everything is fine, continue to the page
    return NextResponse.next();
}

// Middleware runs on all pages except static assets and exception pages
export const config = {
    matcher: ['/((?!_next/static|_next/image|images|backend-offline).*)'],
};