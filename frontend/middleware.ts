import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    console.log("Middleware executed:", req.nextUrl.pathname);

    const token = req.cookies.get("auth_token")?.value;

    if (!token && req.nextUrl.pathname !== "/auth/login") {
        console.log("Unauthorized access, redirecting...");
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!auth/login|_next|static|favicon.ico).*)"], // Middleware akan berjalan di semua halaman kecuali halaman login dan file statis
};
