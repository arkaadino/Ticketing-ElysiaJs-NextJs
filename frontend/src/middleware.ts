import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.pathname;
    const token = req.cookies.get('token')?.value;

    // 1️⃣ Cek apakah backend berjalan
    try {
        const backendCheck = await fetch('http://localhost:5000', { method: 'GET' });
        if (!backendCheck.ok) {
            return NextResponse.redirect(new URL('/backend-offline', req.url));
        }
    } catch (error) {
        return NextResponse.redirect(new URL('/backend-offline', req.url));
    }

    // 2️⃣ Biarkan user mengakses halaman login dan register tanpa token
    if (url.startsWith('/signin')) {
        return NextResponse.next();
    }

    // 3️⃣ Kalau user tidak punya token, redirect ke login
    if (!token) {
        return NextResponse.redirect(new URL('/signin', req.url));
    }

    // 4️⃣ Kalau semua aman, lanjutkan akses ke halaman
    return NextResponse.next();
}

// Middleware berjalan di semua halaman kecuali static assets dan halaman pengecualian
export const config = {
    matcher: ['/((?!_next/static|_next/image|images|backend-offline).*)'],
};
