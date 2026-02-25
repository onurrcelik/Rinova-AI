import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
    // Only protect authenticated app routes.
    // Public routes (/, /login, /register, /plans, /robots.txt, /sitemap.xml, /llms.txt, etc.)
    // are intentionally excluded so Google and AI crawlers can access them.
    matcher: [
        '/dashboard/:path*',
        '/dashboard',
        '/admin/:path*',
        '/app/:path*',
        '/settings/:path*',
        // Protect all API routes EXCEPT auth endpoints and webhooks
        '/api/((?!auth|webhook).*)',
    ],
};
