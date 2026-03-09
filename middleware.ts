import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
    // Run middleware on public landing routes so authenticated users get
    // redirected to the dashboard, and on all protected app routes.
    matcher: [
        '/',           // Landing page — redirect logged-in users to /dashboard
        '/login',
        '/register',
        '/plans',
        '/dashboard/:path*',
        '/dashboard',
        '/admin/:path*',
        '/app/:path*',
        '/settings/:path*',
        // Protect all API routes EXCEPT auth endpoints and webhooks
        '/api/((?!auth|webhook).*)',
    ],
};
