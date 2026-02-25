import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign In — Rinova AI | AI Real Estate Photo Enhancement',
    description: 'Sign in to Rinova AI and start enhancing your real estate photos with AI-powered virtual staging.',
    alternates: {
        canonical: 'https://rinova.capmapai.com/login',
    },
    openGraph: {
        title: 'Sign In — Rinova AI',
        description: 'Sign in to start enhancing your real estate photos with AI-powered virtual staging.',
        url: 'https://rinova.capmapai.com/login',
    },
    robots: {
        index: false,
        follow: true,
    },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return children;
}
