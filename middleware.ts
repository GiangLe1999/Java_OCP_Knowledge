import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Allow login page
    if (path === '/admin/login') {
        return NextResponse.next();
    }

    // Protect all /admin routes except login
    if (path.startsWith('/admin')) {
        const token = request.cookies.get('admin-token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key-change-this-in-production');
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (error) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Protect API routes for admin operations
    if (path.startsWith('/api/topics') || path.startsWith('/api/quizzes') || path.startsWith('/api/parent-topics')) {
        if (request.method !== 'GET') {
            const token = request.cookies.get('admin-token')?.value;

            if (!token) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            try {
                const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key-change-this-in-production');
                await jwtVerify(token, secret);
                return NextResponse.next();
            } catch (error) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/:path*'],
};
