import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Account — Rinova AI | AI Real Estate Photo Enhancement',
    description: 'Create your free Rinova AI account and start enhancing real estate photos instantly with AI-powered virtual staging.',
    alternates: {
        canonical: 'https://rinova.capmapai.com/register',
    },
    openGraph: {
        title: 'Create Account — Rinova AI',
        description: 'Create your free account and start enhancing real estate photos with AI.',
        url: 'https://rinova.capmapai.com/register',
    },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return children;
}
