import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = 'https://rinova.capmapai.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Rinova AI — AI-Powered Real Estate Photo Enhancement',
    template: '%s | Rinova AI',
  },
  description: 'Uplift your real estate photos instantly with AI. Professional-quality virtual staging and photo enhancement in seconds.',
  keywords: ['real estate photo enhancement', 'AI virtual staging', 'property photo AI', 'real estate photography AI', 'Rinova AI'],
  authors: [{ name: 'Rinova AI', url: BASE_URL }],
  creator: 'Rinova AI',
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'Rinova AI',
    title: 'Rinova AI — AI-Powered Real Estate Photo Enhancement',
    description: 'Uplift your real estate photos instantly with AI. Virtual staging, batch processing, and video flythroughs.',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Rinova AI — AI Real Estate Photo Enhancement',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rinova AI — AI-Powered Real Estate Photo Enhancement',
    description: 'Uplift your real estate photos instantly with AI.',
    images: [`${BASE_URL}/og-image.png`],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'Rinova AI',
      description: 'AI-powered real estate photo enhancement',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${BASE_URL}/#app`,
      name: 'Rinova AI',
      url: BASE_URL,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'AI-powered real estate photo enhancement tool that uplifts property listing photos instantly with virtual staging and professional-quality AI processing.',
      offers: { '@type': 'Offer', category: 'Subscription' },
    },
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#org`,
      name: 'Rinova AI',
      url: BASE_URL,
    },
  ],
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
