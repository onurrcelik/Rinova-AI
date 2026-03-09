import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/login', '/register', '/plans'],
                disallow: ['/dashboard', '/app', '/settings', '/api/', '/admin'],
            },
        ],
        sitemap: 'https://rinova.capmapai.com/sitemap.xml',
    };
}
