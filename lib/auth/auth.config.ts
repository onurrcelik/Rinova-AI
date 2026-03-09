import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnLanding = nextUrl.pathname === '/';
            const isOnLogin = nextUrl.pathname.startsWith('/login');
            const isOnRegister = nextUrl.pathname.startsWith('/register');
            const isOnPlans = nextUrl.pathname.startsWith('/plans');

            // Redirect authenticated users away from all public/marketing pages
            if (isOnLanding || isOnLogin || isOnRegister || isOnPlans) {
                if (isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl));
                return true; // Allow unauthenticated visitors to see these pages
            }

            const isAdminRoute = nextUrl.pathname.startsWith('/admin');
            if (isAdminRoute) {
                if (!isLoggedIn) return false;
                if (auth?.user?.role !== 'admin') {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
                return true;
            }

            if (isLoggedIn) return true; // Allow access if logged in

            return false; // Redirect unauthenticated users to login page
        },
        async session({ session, token }) {
            if (token && session.user) {
                // @ts-expect-error — role added to token
                session.user.role = token.role;
            }
            return session;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
