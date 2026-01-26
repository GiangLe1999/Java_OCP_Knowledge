import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        // Compare password
        const isValid = password === adminPassword;

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            );
        }

        // Create JWT token
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || 'fallback-secret-key-change-this-in-production'
        );

        const token = await new SignJWT({ admin: true })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d') // Token expires in 7 days
            .sign(secret);

        // Set cookie
        const response = NextResponse.json({ success: true });
        response.cookies.set('admin-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}
