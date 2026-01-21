import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnLogin = nextUrl.pathname.startsWith('/login');
            const isOnRegister = nextUrl.pathname.startsWith('/register');

            if (isOnLogin || isOnRegister) {
                if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
                return true; // Always allow access to login and register pages
            }

            const isAdminRoute = nextUrl.pathname.startsWith('/admin');
            if (isAdminRoute) {
                if (!isLoggedIn) return false;
                // @ts-ignore
                if (auth?.user?.role !== 'admin') {
                     return Response.redirect(new URL('/', nextUrl));
                }
                return true;
            }

            if (isLoggedIn) return true; // Allow access if logged in

            return false; // Redirect unauthenticated users to login page
        },
        // @ts-ignore
        async session({ session, token }) {
            if (token && session.user) {
                // @ts-ignore
                session.user.role = token.role;
            }
            return session;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
